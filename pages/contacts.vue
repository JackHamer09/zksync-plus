<template>
  <div>
    <ModalContactsAddContact
      v-model:opened="addContactModalOpened"
      v-model:contact-preset="addContactModalContactPreset"
      v-model:error="addContactError"
      @addContact="addContact"
    />
    <ModalContactsContact
      v-model:opened="contactModalOpened"
      :contact="openedContact"
      @remove="removeOpenedContact"
      @edit="editOpenedContact"
    />

    <div class="flex items-center justify-between">
      <h1 class="h1">Contacts</h1>
      <CommonButton class="mt-0.5" variant="primary" @click="openAddContactModal">
        <template #icon>
          <PlusIcon aria-hidden="true" />
        </template>
        <template #default>Add contact</template>
      </CommonButton>
    </div>
    <div>
      <CommonSmallInput v-model.trim="search" class="mb-4" placeholder="Address or name" autofocus>
        <template #icon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </template>
      </CommonSmallInput>

      <div v-if="displayedAddresses.length">
        <template v-for="(group, groupIndex) in displayedAddresses" :key="groupIndex">
          <TypographyCategoryLabel v-if="group.title" class="group-category-label">
            {{ group.title }}
          </TypographyCategoryLabel>
          <CommonCardWithLineButtons>
            <AddressCard
              v-for="item in group.addresses"
              :name="item.name"
              :address="item.address"
              :key="item.address"
              @click="openContact(item)"
            >
              <template #right>
                <CommonIconButton
                  as="RouterLink"
                  :to="{ name: 'transaction-send', query: { address: item.address } }"
                  :icon="PaperAirplaneIcon"
                />
              </template>
            </AddressCard>
          </CommonCardWithLineButtons>
        </template>
      </div>
      <div v-else-if="inProgress">
        <CommonCardWithLineButtons>
          <AddressCardLoader></AddressCardLoader>
        </CommonCardWithLineButtons>
      </div>
      <div v-else-if="error">
        <CommonErrorBlock @try-again="clearSearch">
          {{ error }}
        </CommonErrorBlock>
      </div>
      <div v-else-if="inputtedAddress">
        <CommonCardWithLineButtons>
          <AddressCard name="" :address="inputtedAddress" :key="inputtedAddress" @click="addInputtedAddress">
            <template #right>
              <CommonIconButton as="div" :icon="PlusIcon" />
            </template>
          </AddressCard>
        </CommonCardWithLineButtons>
      </div>
      <div v-else-if="!search">
        <CommonEmptyBlock class="search-empty-block">
          Enter address in the search bar
          <br />
          <span class="mt-1.5 inline-block">
            Or <span class="link cursor-pointer" @click="openAddContactModal">create a contact</span>
          </span>
        </CommonEmptyBlock>
      </div>
      <div v-else>
        <CommonEmptyBlock class="search-empty-block">
          Nothing was found for "{{ search }}"
          <br />
          <span class="mt-1.5 inline-block">Please enter a valid ethereum address</span>
        </CommonEmptyBlock>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { MagnifyingGlassIcon, PaperAirplaneIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import useEns from "@/composables/useEns";

import type { Contact } from "@/store/contacts";
import type { Component } from "vue";

import { useContactsStore } from "@/store/contacts";
import { checksumAddress } from "@/utils/formatters";

type ContactWithIcon = Contact & { icon?: Component };
type AddressesGroup = { title: string | null; addresses: ContactWithIcon[] };

const contactsStore = useContactsStore();
const { userContactsByFirstCharacter } = storeToRefs(contactsStore);

const search = ref("");
const inputtedValidAddress = computed(() => isAddress(search.value));

const inputtedAddress = computed(() => {
  if (address.value && address.value.length) {
    return checksumAddress(address.value);
  } else if (inputtedValidAddress.value) {
    return checksumAddress(search.value);
  }
  return null;
});

const { inProgress, parseEns, address, error } = useEns(search);

const clearSearch = () => (search.value = "");

watch(search, async (newValue) => {
  address.value = undefined;
  if (newValue.endsWith(".eth")) {
    await parseEns();
  }
});

const addContactModalOpened = ref(false);
const addContactModalContactPreset = ref<Contact | undefined>();
const addContactError = ref("");
const openAddContactModal = () => {
  addContactModalOpened.value = true;
};
const addContact = (contact: Contact) => {
  try {
    contactsStore.saveContact(contact);
    addContactModalOpened.value = false;
    setTimeout(() => {
      openedContact.value = contact;
      contactModalOpened.value = true;
    }, 150);
  } catch (error) {
    if (error instanceof Error) {
      addContactError.value = error.message;
    }
  }
};
const addInputtedAddress = () => {
  if (address.value) {
    addContactModalContactPreset.value = {
      name: "",
      address: address.value!,
    };
    addContactModalOpened.value = true;
  } else if (inputtedValidAddress.value) {
    addContactModalContactPreset.value = {
      name: "",
      address: inputtedAddress.value!,
    };
    addContactModalOpened.value = true;
  }
};

const contactModalOpened = ref(false);
const openedContact = ref<Contact | undefined>();
const openContact = (contact: Contact) => {
  openedContact.value = contact;
  contactModalOpened.value = true;
};
const removeOpenedContact = () => {
  if (openedContact.value) {
    contactsStore.removeContact(openedContact.value.address);
    contactModalOpened.value = false;
  }
};
const editOpenedContact = () => {
  if (openedContact.value) {
    addContactModalContactPreset.value = openedContact.value;
    contactModalOpened.value = false;
    setTimeout(() => {
      openAddContactModal();
    }, 150);
  }
};

function findContactsByText(contacts: ContactWithIcon[], text: string) {
  const lowercaseSearch = text.toLowerCase();
  return contacts.filter((item) =>
    Object.values(item)
      .filter((e) => typeof e === "string")
      .some((value) => (value as string).toLowerCase().includes(lowercaseSearch))
  );
}
const displayedAddresses = computed<AddressesGroup[]>(() => {
  const groups: Record<string, AddressesGroup> = {
    default: {
      title: null,
      addresses: [],
    },
  };

  for (const [contactsGroupCharacter, contactsGroup] of Object.entries(userContactsByFirstCharacter.value)) {
    groups[contactsGroupCharacter] = {
      title: contactsGroupCharacter,
      addresses: contactsGroup,
    };
  }

  const result = Object.values(groups);
  if (search.value.length) {
    return result
      .map((group) => {
        return {
          ...group,
          addresses: findContactsByText(group.addresses, search.value),
        };
      })
      .filter((group) => group.addresses.length);
  }
  return result.filter((group) => group.addresses.length);
});
</script>

<style lang="scss" scoped>
.group-category-label:first-child {
  @apply pt-0;
}
</style>

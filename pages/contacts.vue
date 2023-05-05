<template>
  <CommonModal v-model:opened="AddContactModalOpened" class="token-select-modal" title="Add contact">
    <CommonSmallInput v-model="newContact.name" title="Name" class="mb-4" placeholder="Name of the contact">
      <template #icon>
        <UserIcon />
      </template>
    </CommonSmallInput>
    <CommonSmallInput v-model="newContact.address" title="Adress" placeholder="Address of the contact">
      <template #icon> <CreditCardIcon /> </template
    ></CommonSmallInput>
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonAlert v-if="newContact.error" variant="error" :icon="ExclamationCircleIcon" class="z-20 mt-4">
        <p>Enter valid contact info.</p>
      </CommonAlert>
    </transition>
    <CommonButton @click="addContact" variant="primary-solid" class="add-contact-button">Add contact</CommonButton>
  </CommonModal>
  <div class="flex items-center justify-between">
    <h1 class="h1">Contacts</h1>
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <Vue3Lottie
        v-if="newContact.success"
        class="flex max-h-16 w-20 items-center justify-center sm:w-32"
        :animation-data="SuccessConfetti"
        :loop="false"
      />
    </transition>
    <CommonButton variant="primary" @click="openAddContactsModal">Add contact</CommonButton>
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
          <AddressCard v-for="item in group.addresses" :name="item.name" :address="item.address" :key="item.address">
            <template #right>
              <CommonIconButton
                v-if="!isContact.length && isAddressValid"
                @click="openAddContactsModalFromList"
                :icon="PlusIcon"
              />
            </template>
          </AddressCard>
        </CommonCardWithLineButtons>
      </template>
    </div>
    <div v-else-if="!search">
      <CommonEmptyBlock class="search-empty-block">
        Enter address in the search bar
        <br />
        <span class="mt-1.5 inline-block">
          Or <span class="link cursor-pointer" @click="openAddContactsModal">create a contact</span>
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
</template>

<script lang="ts" setup>
import { computed, ref, watch, watchEffect } from "vue";
import { Vue3Lottie } from "vue3-lottie";

import {
  CreditCardIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import SuccessConfetti from "@/assets/lottie/success-confetti.json";

import type { Contact } from "@/store/contacts";
import type { Component } from "vue";

import { useContactsStore } from "@/store/contacts";
import { useOnboardStore } from "@/store/onboard";
import { capitalize, checksumAddress } from "@/utils/formatters";

type ContactWithIcon = Contact & { icon?: Component };
type AddressesGroup = { title: string | null; addresses: ContactWithIcon[] };

const contactsStore = useContactsStore();
const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);
const { userContactsByFirstCharacter } = storeToRefs(contactsStore);

const AddContactModalOpened = ref(false);
const search = ref("");
const newContact = ref({
  name: "",
  address: "",
  error: false,
  success: false,
});

const isAddressValid = computed(() => isAddress(search.value));
const isNewAddressValid = computed(() => isAddress(newContact.value.address));
const isContact = computed(() => {
  if (account.value.address != search.value) {
    return contactsStore.userContacts.filter((contact) => {
      return contact.address === search.value;
    });
  } else {
    return [{ searchInfo: "Your own account" }];
  }
});
console.log(account.value.address, "???", search.value);
const resetErrorStatus = () => {
  newContact.value.error = false;
};
const resetSuccessStatus = () => {
  newContact.value.success = false;
};

let timerId: ReturnType<typeof setTimeout> | null = null;

watch(newContact.value, (newValue) => {
  if (newValue && (newContact.value.error || newContact.value.success)) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      if (newContact.value.error) {
        resetErrorStatus();
      } else if (newContact.value.success) {
        resetSuccessStatus();
      }
      timerId = null;
    }, 3000);
  }
});

const setErrorStatus = () => {
  newContact.value.error = true;
};

const setSuccessStatus = () => {
  newContact.value.success = true;
};

const openAddContactsModal = () => {
  AddContactModalOpened.value = true;
  newContact.value.address = "";
};
const openAddContactsModalFromList = () => {
  AddContactModalOpened.value = true;
  if (inputtedAddressAccount.value && isContact.value.length === 0 && isAddressValid.value) {
    newContact.value.address = inputtedAddressAccount.value.address;
  }
};

const closeModal = () => {
  AddContactModalOpened.value = false;
};

function findContactsByText(contacts: ContactWithIcon[], text: string) {
  const lowercaseSearch = text.toLowerCase();
  return contacts.filter((item) =>
    Object.values(item)
      .filter((e) => typeof e === "string")
      .some((value) => (value as string).toLowerCase().includes(lowercaseSearch))
  );
}

const inputtedAddressAccount = computed<ContactWithIcon | null>(() => {
  if (isAddressValid.value) {
    return {
      name: "",
      address: checksumAddress(search.value),
    };
  }
  return null;
});
const inputtedNewAddressAccount = computed<ContactWithIcon | null>(() => {
  if (isNewAddressValid.value) {
    return {
      name: "",
      address: checksumAddress(newContact.value.address),
    };
  }
  return null;
});

const addContact = () => {
  if (inputtedNewAddressAccount.value && newContact.value.name !== "") {
    contactsStore.saveContact({
      name: capitalize(newContact.value.name),
      address: inputtedNewAddressAccount.value.address,
    });
    newContact.value.name = "";
    newContact.value.address = "";
    search.value = "";
    closeModal();
    setSuccessStatus();
  } else {
    setErrorStatus();
  }
};

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
    const filtered = result
      .map((group) => {
        return {
          ...group,
          addresses: findContactsByText(group.addresses, search.value),
        };
      })
      .filter((group) => group.addresses.length);
    if (inputtedAddressAccount.value && filtered.length === 0) {
      return [
        {
          title: null,
          addresses: [inputtedAddressAccount.value],
        },
      ];
    }
    return filtered;
  }
  return result.filter((group) => group.addresses.length);
});
console.log("heh", userContactsByFirstCharacter.value);
console.log("match", isContact.value);
console.log(contactsStore.userContacts);
console.log(displayedAddresses.value);
</script>

<style lang="scss" scoped>
.add-contact-button {
  @apply mx-auto mt-4;
}
.group-category-label:first-child {
  @apply pt-0;
}
</style>

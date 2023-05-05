<template>
  <CommonModal v-model:opened="AddContactModalOpened" class="token-select-modal" :title="title">
    <CommonSmallInput v-model="newContact.name" title="Name" class="mb-4" placeholder="Name of the contact">
      <template #icon>
        <UserIcon />
      </template>
    </CommonSmallInput>
    <CommonSmallInput v-model="newContact.address" title="Adress" placeholder="Address of the contact">
      <template #icon> <CreditCardIcon /> </template
    ></CommonSmallInput>
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonAlert v-if="newContact.invalid" variant="error" :icon="ExclamationCircleIcon" class="z-20 mt-4">
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
    <CommonButton variant="primary" @click="openAddContactsModal">{{ props.title }}</CommonButton>
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
            <template #icon v-if="item.icon">
              <component :is="item.icon" class="mr-3 text-gray-secondary" aria-hidden="true" />
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
          Or <NuxtLink class="link" :to="{ name: 'contacts' }">create a contact</NuxtLink>
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
import { capitalize, checksumAddress } from "@/utils/formatters";

const props = defineProps({
  title: {
    type: String,
    default: "Add contact",
  },
  error: {
    type: Error,
  },
});

type ContactWithIcon = Contact & { icon?: Component };
type AddressesGroup = { title: string | null; addresses: ContactWithIcon[] };

const contactsStore = useContactsStore();
const { userContactsByFirstCharacter } = storeToRefs(contactsStore);

const AddContactModalOpened = ref(false);
const search = ref("");
const newContact = ref({
  name: "",
  address: "",
  invalid: false,
  success: false,
});

const isAddressValid = computed(() => isAddress(search.value));
const isNewAddressValid = computed(() => isAddress(newContact.value.address));

const resetInvalidStatus = () => {
  newContact.value.invalid = false;
};
const resetSuccessStatus = () => {
  newContact.value.success = false;
};

let timerId: ReturnType<typeof setTimeout> | null = null;

watch(newContact.value, (newValue) => {
  if (newValue && (newContact.value.invalid || newContact.value.success)) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      if (newContact.value.invalid) {
        resetInvalidStatus();
      } else if (newContact.value.success) {
        resetSuccessStatus();
      }
      timerId = null;
    }, 3000);
  }
});

const setInvalidStatus = () => {
  newContact.value.invalid = true;
};

const setSuccessStatus = () => {
  newContact.value.success = true;
};

const openAddContactsModal = () => {
  AddContactModalOpened.value = true;
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
    closeModal();
    setSuccessStatus();
  } else {
    setInvalidStatus();
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
</script>

<style lang="scss" scoped>
.add-contact-button {
  @apply mx-auto mt-4;
}
.group-category-label:first-child {
  @apply pt-0;
}
</style>

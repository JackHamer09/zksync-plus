<template>
  <nav class="navbar-container">
    <nav class="navbar-desktop">
      <SidebarAccountButton />
      <div class="navbar-desktop-links">
        <NuxtLink :to="{ name: 'index' }" class="navbar-desktop-link">
          <HomeIcon class="navbar-desktop-link-icon" aria-hidden="true" />
          <span class="navbar-desktop-link-label">Home</span>
        </NuxtLink>
        <NuxtLink :to="{ name: 'payments' }" class="navbar-desktop-link">
          <ArrowsRightLeftIcon class="navbar-desktop-link-icon" aria-hidden="true" />
          <span class="navbar-desktop-link-label">Payments</span>
        </NuxtLink>
        <NuxtLink :to="{ name: 'contacts' }" class="navbar-desktop-link">
          <UserGroupIcon class="navbar-desktop-link-icon" aria-hidden="true" />
          <span class="navbar-desktop-link-label">Contacts</span>
        </NuxtLink>
      </div>
    </nav>
  </nav>
</template>

<script lang="ts" setup>
import { ArrowsRightLeftIcon, HomeIcon, UserGroupIcon } from "@heroicons/vue/24/outline";
</script>

<style lang="scss" scoped>
.navbar-container {
  @apply pointer-events-none sticky bottom-0 top-auto z-[3] overflow-y-hidden;
  grid-area: menu / menu / menu / menu;

  @media (hover: hover) and (pointer: fine) {
    overflow: hidden overlay;
  }
  @media screen and (min-width: 720px) {
    overflow-y: overlay;
    @apply pointer-events-auto top-0 bottom-auto max-h-screen px-4 py-8;
  }
  @media screen and (min-width: 1024px) {
    @apply px-6;
  }

  .navbar-desktop {
    @apply hidden min-w-[3.5rem] max-w-[3.5rem] md:block xl:max-w-[12.5rem];

    .navbar-desktop-links {
      @apply mt-6 space-y-1;

      .navbar-desktop-link {
        @apply flex w-full items-center rounded-xl bg-transparent py-3 px-4 text-gray-secondary no-underline transition-colors hover:bg-gray-200;
        &.router-link-exact-active {
          @apply bg-white text-primary-400;
        }

        .navbar-desktop-link-icon {
          @apply h-6 w-6 text-inherit;
        }
        .navbar-desktop-link-label {
          @apply mr-auto ml-4 hidden font-medium leading-4 tracking-[-0.1px] xl:block;
        }
      }
    }
  }
}
</style>

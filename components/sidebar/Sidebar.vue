<template>
  <nav class="navbar-container">
    <nav class="navbar-inner">
      <SidebarAccountButton />
      <div class="navbar-links-container">
        <NuxtLink :to="{ name: 'index' }" class="navbar-link">
          <HomeIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Home</span>
        </NuxtLink>
        <NuxtLink :to="{ name: 'payments' }" class="navbar-link">
          <ArrowsRightLeftIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Payments</span>
        </NuxtLink>
        <NuxtLink :to="{ name: 'contacts' }" class="navbar-link">
          <UserGroupIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Contacts</span>
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
  @apply sticky bottom-0 top-auto z-[3];
  grid-area: menu / menu / menu / menu;

  @media screen and (min-width: 720px) {
    @apply top-0 bottom-auto max-h-screen px-4 py-8; /* pointer-events-auto */
  }
  @media screen and (min-width: 1024px) {
    @apply px-6;
  }

  .navbar-inner {
    @apply grid min-w-[3.5rem] grid-cols-[max-content_1fr] bg-white md:block md:max-w-[3.5rem] md:bg-transparent xl:max-w-[12.5rem]; /* hidden md:block */

    .navbar-links-container {
      @apply flex justify-around space-y-1 pr-3 md:mt-6 md:flex-col md:pr-0;

      .navbar-link {
        @apply flex items-center rounded-xl bg-transparent text-gray-secondary no-underline transition-colors md:w-full md:py-3 md:px-4 md:hover:bg-gray-200;
        &.router-link-exact-active {
          @apply bg-white text-primary-400;
        }

        .navbar-link-icon {
          @apply h-6 w-6 text-inherit;
        }
        .navbar-link-label {
          @apply mr-auto ml-4 hidden font-medium leading-4 tracking-[-0.1px] xl:block;
        }
      }
    }
  }
}
</style>

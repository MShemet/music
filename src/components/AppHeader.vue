<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useModalStore from '@/stores/modal';
import useUserStore from '@/stores/user';
import { computed } from 'vue';

const { locale } = useI18n({ useScope: 'global' });

const modalStore = useModalStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const toggleAuthModal = function toggleAuthModalVisibility() {
  modalStore.isOpen = !modalStore.isOpen;
};

const signout = function signoutUser() {
  userStore.signout();

  if (route.meta.requiresAuth) {
    router.push({ name: 'home' });
  }
};

const changeLocale = function changeLocale() {
  locale.value = locale.value === 'fr' ? 'en' : 'fr';
};

const currentLocale = computed(() => {
  return locale.value === 'fr' ? 'French' : 'English';
});
</script>

<template>
  <!-- Header -->
  <header
    id="header"
    class="bg-gray-700"
  >
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link
              class="px-2 text-white"
              :to="{ name: 'about' }"
            >
              About
            </router-link>
          </li>

          <li v-if="!userStore.userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              Login / Register
            </a>
          </li>

          <template v-else>
            <li>
              <router-link
                class="px-2 text-white"
                :to="{ name: 'manage' }"
              >
                Manage
              </router-link>
            </li>
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="signout"
              >
                Logout
              </a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="changeLocale"
            >
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

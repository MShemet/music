<script setup>
import { onBeforeMount } from 'vue';

import AppHeader from '@/components/AppHeader.vue';
import AppAuth from '@/components/AppAuth.vue';
import PlayerAudio from '@/components/PlayerAudio.vue';

import { auth } from '@/includes/firebase';
import useUserStore from '@/stores/user';

const userStore = useUserStore();

onBeforeMount(() => {
  if (auth.currentUser) {
    userStore.userLoggedIn = true;
  }
});
</script>

<template>
  <AppHeader />

  <router-view v-slot="{ Component }">
    <transition
      name="fade"
      mode="out-in"
    >
      <component :is="Component"></component>
    </transition>
  </router-view>

  <PlayerAudio />

  <AppAuth />
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>

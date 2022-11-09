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

  <RouterView />

  <PlayerAudio />

  <AppAuth />
</template>

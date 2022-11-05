<script setup>
import { onBeforeMount, ref } from 'vue';

import { query, where, getDocs } from 'firebase/firestore';
import { auth, songsCollection } from '@/includes/firebase';

import UploadFiles from '@/components/UploadFiles.vue';
import CompositionItem from '@/components/CompositionItem.vue';

const songs = ref([]);

onBeforeMount(async () => {
  const q = query(songsCollection, where('uid', '==', auth.currentUser.uid));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const song = {
      ...doc.data(),
      docID: doc.id,
    };

    songs.value.push(song);
  });
});
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UploadFiles />
      </div>

      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>

          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-for="song in songs"
              :key="song.docID"
              :song="song"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

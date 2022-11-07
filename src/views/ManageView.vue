<script setup>
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import { query, where, getDocs } from 'firebase/firestore';
import { auth, songsCollection } from '@/includes/firebase';

import UploadFiles from '@/components/UploadFiles.vue';
import CompositionItem from '@/components/CompositionItem.vue';

const songs = ref([]);
const unsavedFlag = ref(false);

const updateUnsavedFlag = function updateUnsavedFlag(value) {
  unsavedFlag.value = value;
};

const updateSong = function updateSong(i, values) {
  songs.value[i].modified_name = values.modified_name;
  songs.value[i].genre = values.genre;
};

const removeSong = function removeSong(i) {
  songs.value.splice(i, 1);
};

const addSong = function addSong(doc) {
  const song = {
    ...doc.data(),
    docID: doc.id,
  };

  songs.value.push(song);
};

onBeforeMount(async () => {
  const q = query(songsCollection, where('uid', '==', auth.currentUser.uid));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(addSong);
});

onBeforeRouteLeave((to, from, next) => {
  if (!unsavedFlag.value) {
    next();
  } else {
    const leave = confirm(
      'You have unsaved changes. Are you sure you want to leave?'
    );
    next(leave);
  }
});
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UploadFiles :add-song="addSong" />
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
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :update-song="updateSong"
              :remove-song="removeSong"
              :update-unsaved-flag="updateUnsavedFlag"
              :index="i"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

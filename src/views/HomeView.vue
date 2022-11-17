<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import {
  query,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import { songsCollection, db } from '@/includes/firebase';
import vIconSecondary from '@/directives/icon-secondary';

import SongItem from '@/components/SongItem.vue';

const songs = ref([]);
const maxPerPage = ref(10);
const pendingRequest = ref(false);

const getSongs = async function getSongsRequest() {
  if (pendingRequest.value) {
    return;
  }

  pendingRequest.value = true;

  let snapshots;

  if (songs.value.length) {
    const lastDoc = doc(db, 'songs', songs.value[songs.value.length - 1].docID);
    const songRef = await getDoc(lastDoc);

    const q = query(
      songsCollection,
      orderBy('modified_name'),
      limit(maxPerPage.value),
      startAfter(songRef)
    );

    snapshots = await getDocs(q);
  } else {
    const q = query(
      songsCollection,
      orderBy('modified_name'),
      limit(maxPerPage.value)
    );

    snapshots = await getDocs(q);
  }

  snapshots.forEach((doc) => {
    songs.value.push({
      ...doc.data(),
      docID: doc.id,
    });
  });

  pendingRequest.value = false;
};

const handleScroll = function handleScroll() {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    getSongs();
  }
};

onBeforeMount(() => {
  getSongs();

  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
            suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
            pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <!-- v-icon.right.yellow="'headphones-alt'" -->
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem
            v-for="song in songs"
            :key="song.docID"
            :song="song"
          />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

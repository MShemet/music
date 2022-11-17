<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  doc,
  addDoc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db, auth, commentsCollection } from '@/includes/firebase';
import useUserStore from '@/stores/user';
import usePlayerStore from '@/stores/player';

const { t, n } = useI18n();

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const playerStore = usePlayerStore();

const song = ref({});
const comments = ref([]);
const comment_in_submition = ref(false);
const comment_show_alert = ref(false);
const comment_alert_variant = ref('bg-blue-500');
const comment_alert_message = ref(
  'Please wait! Your comment is being submitted'
);

const sort = ref('1');

const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    if (sort.value === '1') {
      return new Date(b.datePosted) - new Date(a.datePosted);
    }

    return new Date(a.datePosted) - new Date(b.datePosted);
  });
});

const schema = {
  comment: 'required|min:3',
};

const getComments = async function getComments() {
  const q = query(commentsCollection, where('sid', '==', route.params.id));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    comments.value.push({
      ...doc.data(),
      docID: doc.id,
    });
  });
};

const addComment = async function addComment(values, { resetForm }) {
  comment_in_submition.value = true;
  comment_show_alert.value = true;
  comment_alert_variant.value = 'bg-blue-500';
  comment_alert_message.value = 'Please wait! Your comment is being submitted';

  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    sid: route.params.id,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid,
  };

  try {
    await addDoc(commentsCollection, comment);

    song.value.comment_count += 1;

    const songRef = doc(db, 'songs', route.params.id);

    await updateDoc(songRef, {
      comment_count: song.value.comment_count,
    });

    await getComments();
  } catch (error) {
    comment_in_submition.value = false;
    comment_alert_variant.value = 'bg-red-500';
    comment_alert_message.value = 'Something went wrong! Try again later.';
    return;
  }

  comment_in_submition.value = false;
  comment_alert_variant.value = 'bg-green-500';
  comment_alert_message.value = 'Comment added!';

  resetForm();
};

watch(sort, (newVal) => {
  if (newVal === route.query.sort) {
    return;
  }

  router.push({
    query: {
      sort: newVal,
    },
  });
});

onBeforeMount(async () => {
  const query = doc(db, 'songs', route.params.id);
  const docSnapshot = await getDoc(query);

  if (!docSnapshot.exists) {
    router.push({ name: 'home' });
    return;
  }

  const { sort: qSort } = route.query;

  sort.value = qSort === '1' || qSort === '2' ? qSort : '1';

  song.value = docSnapshot.data();

  getComments();
});
</script>

<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click="playerStore.newSong(song)"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ n(1, 'currency', 'ja') }}</div>
        </div>
      </div>
    </section>

    <!-- Form -->
    <section
      id="comments"
      class="container mx-auto mt-6"
    >
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">
            {{
              t(
                'song.comment_count',
                { count: song.comment_count },
                song.comment_count
              )
            }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form
            v-if="userStore.userLoggedIn"
            :validation-schema="schema"
            @submit="addComment"
          >
            <vee-field
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
              as="textarea"
              name="comment"
            ></vee-field>
            <ErrorMessage
              class="text-red-600"
              name="comment"
            />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submition"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.docID"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>{{ comment.content }}</p>
      </li>
    </ul>
  </main>
</template>

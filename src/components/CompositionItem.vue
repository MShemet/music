<script setup>
import { ref } from 'vue';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '@/includes/firebase';

const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  updateSong: {
    type: Function,
    required: true,
  },
  removeSong: {
    type: Function,
    required: true,
  },
  updateUnsavedFlag: {
    type: Function,
  },
  index: {
    type: Number,
    required: true,
  },
});

const showForm = ref(false);
const in_submition = ref(false);
const show_alert = ref(false);
const alert_variant = ref('bg-blue-500');
const alert_message = ref('Please wait! Updating song info.');

const schema = {
  modified_name: 'required',
  genre: 'alpha_spaces',
};

const edit = async function submitForm(values) {
  in_submition.value = true;
  show_alert.value = true;
  alert_variant.value = 'bg-blue-500';
  alert_message.value = 'Please wait! Updating song info.';

  try {
    const songRef = doc(db, 'songs', props.song.docID);
    await updateDoc(songRef, values);
  } catch (error) {
    in_submition.value = false;
    alert_variant.value = 'bg-red-500';
    alert_message.value = 'Something went wrong! Try again later.';
    return;
  }

  props.updateSong(props.index, values);
  props.updateUnsavedFlag(false);

  in_submition.value = false;
  alert_variant.value = 'bg-green-500';
  alert_message.value = 'Success!';
};

const deleteSong = async function deleteSong() {
  const songRefStorage = storageRef(
    storage,
    `songs/${props.song.original_name}`
  );
  await deleteObject(songRefStorage);

  const songRefDb = doc(db, 'songs', props.song.docID);
  await deleteDoc(songRefDb);

  props.removeSong(props.index);
};
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>

      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>

      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modified_name"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage
            class="text-red-600"
            name="modified_name"
          />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            name="genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage
            class="text-red-600"
            name="genre"
          />
        </div>

        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submition"
        >
          Submit
        </button>

        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submition"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

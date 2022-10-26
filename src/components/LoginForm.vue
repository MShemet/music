<script setup>
import { ref } from 'vue';

const loginSchema = {
  email: 'required|min:3|max:100|email',
  password: 'required|min:3|max:100',
};

const login_in_submition = ref(false);
const login_show_alert = ref(false);
const login_alert_variant = ref('bg-blue-500');
const login_alert_msg = ref('Please wait! We are logging you in');

const login = function submitLoginForm(values) {
  login_show_alert.value = true;
  login_in_submition.value = true;
  login_alert_variant.value = 'bg-blue-500';
  login_alert_msg.value = 'Please wait! We are logging you in';
  login_alert_variant.value = 'bg-green-500';
  login_alert_msg.value = 'Success! Your are now logged in.';
};
</script>

<template>
  <!-- Login Form -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>

  <vee-form
    :validation-schema="loginSchema"
    @submit="login"
  >
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
        name="email"
      />
      <ErrorMessage
        class="text-red-600"
        name="email"
      />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
        name="password"
      />
      <ErrorMessage
        class="text-red-600"
        name="password"
      />
    </div>

    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disbled="login_in_submition"
    >
      Submit
    </button>
  </vee-form>
</template>

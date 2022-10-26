import { defineStore } from 'pinia';

export default defineStore('modal', {
  state() {
    return {
      isOpen: false,
    };
  },

  getters: {
    hiddenClass() {
      return this.isOpen ? '' : 'hidden';
    },
  },

  // actions: {
  //   increment() {
  //     this.counter += 1;
  //   },
  // },
});

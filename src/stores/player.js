import { defineStore } from 'pinia';
import { Howl } from 'howler';

export default defineStore('player', {
  state() {
    return {
      current_song: {},
      sound: {},
    };
  },

  // getters: {
  //   hiddenClass() {
  //     return this.isOpen ? '' : 'hidden';
  //   },
  // },

  actions: {
    async newSong(song) {
      this.current_song = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      this.sound.play();
    },
  },
});

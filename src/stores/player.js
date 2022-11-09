import { defineStore } from 'pinia';
import { Howl } from 'howler';

export default defineStore('player', {
  state() {
    return {
      current_song: {},
      sound: {},
    };
  },

  getters: {
    playing() {
      if (this.sound.playing) {
        return this.sound.playing();
      }
      return false;
    },
  },

  actions: {
    async newSong(song) {
      this.current_song = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      this.sound.play();
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
  },
});

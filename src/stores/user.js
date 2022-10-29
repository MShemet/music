import { defineStore } from 'pinia';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/includes/firebase';

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false,
  }),

  // getters: {
  //   hiddenClass() {
  //     return this.isOpen ? '' : 'hidden';
  //   },
  // },

  actions: {
    async register(values) {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      await updateProfile(userCred.user, {
        displayName: values.name,
      });

      this.userLoggedIn = true;
    },

    async authenticate(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password);

      this.userLoggedIn = true;
    },

    async signout() {
      await signOut(auth);

      this.userLoggedIn = false;
    },
  },
});

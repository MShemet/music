import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableIndexedDbPersistence,
  collection,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCHev4NxkEvnqLNLGgH-shVFbjM1vkMDYI',
  authDomain: 'music-3c49c.firebaseapp.com',
  projectId: 'music-3c49c',
  storageBucket: 'music-3c49c.appspot.com',
  // messagingSenderId: '1025597322841',
  appId: '1:1025597322841:web:00d1703aca9ff208e82348',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

enableIndexedDbPersistence(db).catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
});

const usersCollection = collection(db, 'users');
const songsCollection = collection(db, 'songs');
const commentsCollection = collection(db, 'comments');

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage,
};

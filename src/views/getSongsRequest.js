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

const maxPerPage = 10;

export const getSongsRequest = async function getSongsRequest(docID) {
  const songs = [];
  let snapshots;

  if (docID) {
    const lastDoc = doc(db, 'songs', docID);
    const songRef = await getDoc(lastDoc);

    const q = query(
      songsCollection,
      orderBy('modified_name'),
      limit(maxPerPage),
      startAfter(songRef)
    );

    snapshots = await getDocs(q);
  } else {
    const q = query(
      songsCollection,
      orderBy('modified_name'),
      limit(maxPerPage)
    );

    snapshots = await getDocs(q);
  }

  snapshots.forEach((doc) => {
    songs.push({
      ...doc.data(),
      docID: doc.id,
    });
  });

  return songs;
};

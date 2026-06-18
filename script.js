import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ai-studio-1d27153b-9c3f-496b-99d3-030916a8cc5b",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const snap = await getDocs(collection(db, 'custom_apps'));
  snap.docs.forEach(d => {
    console.log(d.id, d.data().title, d.data().category);
  });
}
check();

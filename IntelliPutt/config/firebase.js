{/* 
    Configures connection to firebase.
    ISSUE: exposed API keys but only because it wouldn't work with (.env.local)
*/}

import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {ref as storageReference} from 'firebase/storage'
// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app); //Added to be able to connect to Firestore
export const storage = getStorage(app);     //For photo and video support

export const uploadFromBlobAsync = async ({ blobUrl, name }) => {
  if (!blobUrl || !name) return null

  try {
    const blob = await fetch(blobUrl).then((r) => r.blob())
    const snapshot = await storageReference().child(name).put(blob)
    return await snapshot.storageReference.getDownloadURL()
  } catch (error) {
    throw error
  }
}
export default app;

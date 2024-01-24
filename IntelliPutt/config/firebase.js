import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAzgblCXbj26BLR7zwA7cS3AL9YAtT3Pmo",
  authDomain: "intelliputt-2024.firebaseapp.com",
  projectId: "intelliputt-2024",
  databaseURL: "https://intelliputt-2024-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "intelliputt-2024.appspot.com",
  messagingSenderId: "948856177961",
  appId: "1:948856177961:web:70e43e3b337f65b3d86338",
  measurementId: "G-FY8BZ58JLE"
};

const app = initializeApp(firebaseConfig);
export default app;

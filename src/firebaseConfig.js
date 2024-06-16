import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW0Qe3ddIWpI4mbXMapzbQnfbKInAJO6M",
  authDomain: "notekeep-3203e.firebaseapp.com",
  projectId: "notekeep-3203e",
  storageBucket: "notekeep-3203e.appspot.com",
  messagingSenderId: "217306064667",
  appId: "1:217306064667:web:fca9fe2b0239539ec5d5be",
  measurementId: "G-YL38XQ9D12",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

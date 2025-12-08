// firebase.ts - GANTI DENGAN CONFIG MILIKMU
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

// ⚠️⚠️⚠️ GANTI INI DENGAN CONFIG MILIKMU SENDIRI ⚠️⚠️⚠️
const firebaseConfig = {
  apiKey: "AIzaSyAkuxoMg6zGy4eJkZQSuOoz2-KYKrhmOS4",        // MILIKMU
  authDomain: "chatapp-f70ab.firebaseapp.com",             // MILIKMU
  projectId: "chatapp-f70ab",                               // MILIKMU
  storageBucket: "chatapp-f70ab.appspot.com",               // MILIKMU
  messagingSenderId: "1008019094942",                       // MILIKMU
  appId: "1:1008019094942:web:xxxxxx",                     // MILIKMU (ganti dengan appId milikmu)
  measurementId: "G-XXXXXX"                                // Opsional
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const messagesCollection = collection(db, "messages") as CollectionReference<DocumentData>;

export {
  auth,
  db,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
};

export type { User };
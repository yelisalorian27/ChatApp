import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBD6ERVGde9Jx3Css0SWTG2WyhTSEGdfDQ",
  authDomain: "pbpapp-92dbc.firebaseapp.com",
  projectId: "pbpapp-92dbc",
  storageBucket: "pbpapp-92dbc.appspot.com",
  messagingSenderId: "1087525054806",
  appId: "1:1087525054806:web:1362f27f60565177768ef7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
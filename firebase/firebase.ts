import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBGwfwUZTd6wNBILo0yTBBbCNhv-yyIibQ",
    authDomain: "nextauth-11f30.firebaseapp.com",
    projectId: "nextauth-11f30",
    storageBucket: "nextauth-11f30.appspot.com",
    messagingSenderId: "922711768211",
    appId: "1:922711768211:web:b26340c06a69a81af9a166"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();

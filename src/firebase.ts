import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf4JJT9Np1OrfcC8qNagcplWMK27l5eiE",
  authDomain: "bikemarket-9eca4.firebaseapp.com",
  projectId: "bikemarket-9eca4",
  storageBucket: "bikemarket-9eca4.firebasestorage.app",
  messagingSenderId: "180807162929",
  appId: "1:180807162929:web:24e405cd9594d4d2730910",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrrVJAEik-Ck-R1lA8Ev8iSEWi_rA_9PQ",
  authDomain: "shopping-application-33ef6.firebaseapp.com",
  projectId: "shopping-application-33ef6",
  storageBucket: "shopping-application-33ef6.firebasestorage.app",
  messagingSenderId: "285880791028",
  appId: "1:285880791028:web:088855e9f2249d5ad413a1",
  measurementId: "G-HH50KDWFY5"
};

// Initialize Firebase client-side safely for Next.js SSR environment
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

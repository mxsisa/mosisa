import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration for AutoSOAP AI
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAZ9S_7ulBPi_VL9Z9XYaTurqzFZeegnrE",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "autosoapai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "autosoapai",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "autosoapai.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "158775640992",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:158775640992:web:72ef6b1529bf03eaad1ac5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-B6C37NK2DY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Production mode - no emulators
// Emulators disabled for live production site

export default app;

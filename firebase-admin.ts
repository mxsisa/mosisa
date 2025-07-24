import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let app;
if (!getApps().length) {
  // For development, use a minimal config
  // In production, you would use proper service account credentials
  app = initializeApp({
    // Add your Firebase config here if needed
    // For now, we'll use a minimal setup
  });
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("✅ Firebase Admin initialized");

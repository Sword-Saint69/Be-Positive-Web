import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOpOi76ZUncIDiAqk5bU8sY1CY65om2ws",
  authDomain: "be-positive-haripad.firebaseapp.com",
  projectId: "be-positive-haripad",
  storageBucket: "be-positive-haripad.firebasestorage.app",
  messagingSenderId: "122508735649",
  appId: "1:122508735649:web:dd2c40d9d1ed81b8802ce0",
  measurementId: "G-6LM5Q8W717",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable persistence
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == "failed-precondition") {
      console.warn("Persistence failed: Multiple tabs open");
    } else if (err.code == "unimplemented") {
      console.warn("Persistence failed: Browser not supported");
    }
  });
}

export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;

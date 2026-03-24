import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1ydUlNtKr9dsB_VWujfCF65hB-AeKCoA",
  authDomain: "seva-kendra-8773f.firebaseapp.com",
  projectId: "seva-kendra-8773f",
  storageBucket: "seva-kendra-8773f.firebasestorage.app",
  messagingSenderId: "454515421158",
  appId: "1:454515421158:web:d626da11d5d9b60e01b027"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Setup exported services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

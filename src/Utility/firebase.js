import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAT_GUwR5xpyWQJE05jUqBgEQ-0nsDHlfY",
  authDomain: "clone-15fe9.firebaseapp.com",
  projectId: "clone-15fe9",
  storageBucket: "clone-15fe9.firebasestorage.app",
  messagingSenderId: "335809448625",
  appId: "1:335809448625:web:1d4ffec4ce643687e67090",
  measurementId: "G-7SH31E87N0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);

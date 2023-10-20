// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { env } from "~/env.mjs";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "chut-next.firebaseapp.com",
  projectId: "chut-next",
  storageBucket: "chut-next.appspot.com",
  messagingSenderId: "919266283531",
  appId: "1:919266283531:web:b021c5d4662f2d02e4f70e",
  measurementId: "G-ZLEDY9DE6X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null,
);

export const initFirebase = () => app;

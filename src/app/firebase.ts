// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgYHwP_IAoQDcOllaEum1GTck-QJypdUk",
  authDomain: "chut-next.firebaseapp.com",
  projectId: "chut-next",
  storageBucket: "chut-next.appspot.com",
  messagingSenderId: "919266283531",
  appId: "1:919266283531:web:b021c5d4662f2d02e4f70e",
  measurementId: "G-ZLEDY9DE6X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

export const initFirebase = () => app;

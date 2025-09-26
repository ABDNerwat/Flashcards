// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsf-fd11Wetj2yF9MYfd850-yHU530Tqs",
  authDomain: "flashcard-26035.firebaseapp.com",
  projectId: "flashcard-26035",
  storageBucket: "flashcard-26035.firebasestorage.app",
  messagingSenderId: "696129293503",
  appId: "1:696129293503:web:9cb762111476b5a1a74a0a",
  measurementId: "G-VTM1K9BYNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
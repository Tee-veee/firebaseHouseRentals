import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBByGAWtl8tw6KfrXBAi_KAt7Q4c5kBqrI",
  authDomain: "realestateapp-1fdab.firebaseapp.com",
  projectId: "realestateapp-1fdab",
  storageBucket: "realestateapp-1fdab.appspot.com",
  messagingSenderId: "601062940600",
  appId: "1:601062940600:web:fa227fd3a6758766d1394d",
  measurementId: "G-P7J9RQLQ62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdQ_ZLTarnS8AmjywWhaAd4PrNUXbo3z8",
  authDomain: "webrtc-demo-4cd01.firebaseapp.com",
  projectId: "webrtc-demo-4cd01",
  storageBucket: "webrtc-demo-4cd01.appspot.com",
  messagingSenderId: "1061028592651",
  appId: "1:1061028592651:web:c22008c2fd940c60c89b0e",
  measurementId: "G-XKQT24ZP5Q"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

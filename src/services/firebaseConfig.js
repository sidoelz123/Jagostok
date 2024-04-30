import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC3TahlXyvsF7jU5vKZdHEOy3ZuJAZD2bU",
  authDomain: "jagostok-8d5a5.firebaseapp.com",
  projectId: "jagostok-8d5a5",
  storageBucket: "jagostok-8d5a5.appspot.com",
  messagingSenderId: "10448656841",
  appId: "1:10448656841:web:a3dfad747e0e8a6abb7018",
  measurementId: "G-NGVCVD2R9G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
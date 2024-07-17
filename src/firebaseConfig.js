// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {initializeAuth,getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore,collection} from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBpZ3MtbNeYdyQKZ8hKJ7CboghUnajKm8",
  authDomain: "tfg-ine.firebaseapp.com",
  projectId: "tfg-ine",
  storageBucket: "tfg-ine.appspot.com",
  messagingSenderId: "262573534211",
  appId: "1:262573534211:web:33e278ef98ab47b52ff236",
  measurementId: "G-0S75KYQZ7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{
     persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app);

export const userRef = collection(db,'users')

export const RoomRef = collection(db,'rooms')




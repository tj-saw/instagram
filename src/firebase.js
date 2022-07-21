// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvnX5Xi4zSbhFdTSjl6oHpfiOeE-Pf1ow",
  authDomain: "rocketgram-990fe.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://rocketgram-990fe-default-rtdb.firebaseio.com/",
  projectId: "rocketgram-990fe",
  storageBucket: "rocketgram-990fe.appspot.com",
  messagingSenderId: "1024679078993",
  appId: "1:1024679078993:web:2d816f051c9050257c1c70"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);

// ADD FIREBASE STORAGE

// Get a reference to the storage service, which is used to create references in your storage bucket
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(firebaseApp);

// // Create a storage reference from our storage service
// export const storageRef = ref(storage);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebaseApp);

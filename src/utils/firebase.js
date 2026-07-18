
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewsbyte.firebaseapp.com",
  projectId: "interviewsbyte",
  storageBucket: "interviewsbyte.firebasestorage.app",
  messagingSenderId: "278111120262",
  appId: "1:278111120262:web:8322016aaf3e0b593a9a07"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUNcvHTDG7QKyzoHKX5zgKlqzAdQiRwoc",
  authDomain: "smash-4cc78.firebaseapp.com",
  projectId: "smash-4cc78",
  storageBucket: "smash-4cc78.appspot.com",
  messagingSenderId: "531302303877",
  appId: "1:531302303877:web:7a366401de80db078a41ec",
  measurementId: "G-3SWVN1XWDS",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;

import { initializeApp } from "firebase/app";
// @ts-ignore - getReactNativePersistence is exported from RN entry point, resolved by Metro
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPoI50tpTDm9egMWmQtXxw5KP71rX7h-U",
  authDomain: "vego-37a34.firebaseapp.com",
  projectId: "vego-37a34",
  storageBucket: "vego-37a34.firebasestorage.app",
  messagingSenderId: "1040404434273",
  appId: "1:1040404434273:web:c7649d08bc0a0d0b444920",
  measurementId: "G-M65V30JEL5",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export default app;

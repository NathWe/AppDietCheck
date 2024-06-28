import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  reactNativeLocalPersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCknbCknbCasu1OaIsbWFwRUpffNOUK7-L_Ff4",
  authDomain: "appdietcheck.firebaseapp.com",
  projectId: "appdietcheck",
  storageBucket: "appdietcheck.appspot.com",
  messagingSenderId: "68608594843",
  appId: "1:68608594843:web:24f390175af03862af873e",
  measurementId: "G-EFTXYY2VTK",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: reactNativeLocalPersistence,
  storage: AsyncStorage,
});

const db = getFirestore(app);

export { auth, db };

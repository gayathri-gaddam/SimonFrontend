import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhuZTzXU7ejYmMcuIJ3JQiKZDEIdIRwCU",
  authDomain: "simon-game-e2f17.firebaseapp.com",
  projectId: "simon-game-e2f17",
  storageBucket: "simon-game-e2f17.appspot.com",
  messagingSenderId: "498986462539",
  appId: "1:498986462539:web:7e530b951bc02f5f3b0cce",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account ",
});

export { auth, googleProvider, db };

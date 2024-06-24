// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  signInWithPopup,

} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCudL3PVhIdRJacn5mOJOBDc9bmNBeIfrw",
  authDomain: "vinedo-14654.firebaseapp.com",
  projectId: "vinedo-14654",
  storageBucket: "vinedo-14654.appspot.com",
  messagingSenderId: "1009807012250",
  appId: "1:1009807012250:web:c71d49d1ddf33b776c0a23",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig, "venideo1");
// const auth = getAuth(app);
const fbProvider = new FacebookAuthProvider();
// const firebase= initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
// const auth = new Auth();

const auth = getAuth(app);



export { auth, provider, fbProvider };
export default app

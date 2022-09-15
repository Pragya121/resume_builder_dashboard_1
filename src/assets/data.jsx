import err from '../assets/images/error.gif';
import design from '../assets/images/design.png';
import loader from '../assets/images/loader.gif';
import logo from '../assets/images/app_logo.png'
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider , signOut } from "firebase/auth";
import axios from "axios";
// 1j1qXOYmyDjFHZ01VvocoRlBV4Nzb4aLenRjyTAUNc90

 const firebaseConfig = {
  apiKey: "AIzaSyD8yYba6Z_DpycbSF95Po9PqoDBSnYKrWE",
  authDomain: "podiumpro-9cc8e.firebaseapp.com",
  databaseURL: "https://podiumpro-9cc8e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "podiumpro-9cc8e",
  storageBucket: "podiumpro-9cc8e.appspot.com",
  messagingSenderId: "752240947198",
  appId: "1:752240947198:web:bcd7cea68c697b0ff25aaf",
  measurementId: "G-XSBLGMDXFR"
};
const BASE_URL = "https://us-central1-podiumpro-9cc8e.cloudfunctions.net";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const getIdToken = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        user.getIdToken().then((idToken) => {
          resolve(idToken);
        }, (error) => {
          resolve(null);
        });
      } else {
        resolve(null);
      }
    });
  });
};
export default {
    err, loader, logo, app, provider, auth, design, signOut, axios, BASE_URL, getIdToken
}

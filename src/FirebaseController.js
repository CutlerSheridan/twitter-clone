// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  getDocs,
  addDoc,
  doc,
  collection,
  query,
  orderBy,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore/lite';
import * as model from './model';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB6lEJ3DR8YXb8blI6OQUcQzvDNy3JAutI',
  authDomain: 'twitter-clone-febc8.firebaseapp.com',
  projectId: 'twitter-clone-febc8',
  storageBucket: 'twitter-clone-febc8.appspot.com',
  messagingSenderId: '888100495236',
  appId: '1:888100495236:web:2fd17ea38ba7c176d3c7d1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
const signInWithGoogle = () => {
  signInWithPopup(auth, provider);
};
const signOutUser = () => {
  signOut(auth);
};

const checkIfUserIsNew = async (userAuth) => {
  if (userAuth) {
    try {
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, 'users', userAuth.uid);
        const userDoc = await transaction.get(docRef);
        if (!userDoc.exists()) {
          transaction.set(docRef, model.User(userAuth));
          transaction.update(docRef, { joinedDate: serverTimestamp() });
        }
      });
    } catch (e) {
      console.error('Transaction failed: ', e);
    }
    // const docRef = await getDoc(doc(db, 'users', userAuth.uid));
    // if (!docRef.data()) {
    //   await addUserToDB(userAuth);
    // }
  }
};
const addUserToDB = async (userAuth) => {
  const newUser = model.User(userAuth);
  const docRef = doc(db, 'users', userAuth.uid);
  await setDoc(docRef, newUser);
  await updateDoc(docRef, { joinedDate: serverTimestamp() });
};

export { auth, signInWithGoogle, checkIfUserIsNew, signOutUser };

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
          transaction.update(docRef, { joinDate: serverTimestamp() });
        }
      });
    } catch (e) {
      console.error('Transaction failed: ', e);
    }
  }
};
const getUserInfo = async (userId) => {
  return (await getDoc(doc(db, 'users', userId))).data();
};
const getUserTweets = async (userId) => {
  const querySnapshot = await getDocs(
    query(collection(db, 'users', userId, 'tweets'), orderBy('creationDate'))
  );
  const tweetsArray = [];
  querySnapshot.forEach((tweet) => {
    tweetsArray.push(tweet.data());
  });
  return tweetsArray;
};

export {
  auth,
  signInWithGoogle,
  checkIfUserIsNew,
  signOutUser,
  getUserInfo,
  getUserTweets,
};

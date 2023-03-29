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
} from 'firebase/firestore/lite';

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
  if (userAuth.uid) {
    const docRef = await getDoc(doc(db, 'users', userAuth.uid));
    if (!docRef.data()) {
      addUserToDB(userAuth);
    }
  }
};
const addUserToDB = (userAuth) => {
  console.log(UserObject(userAuth));
};
const UserObject = (userAuth) => {
  let { uid: id, displayName } = userAuth;
  return {
    id,
    displayName,
    avi: userAuth.photoURL || null,
    banner: null,
    bio: null,
    joinDate: new Date(),
    following: [],
    followers: [],
    isPrivate: false,
    pinnedTweet: null,
  };
};

export { auth, signInWithGoogle, checkIfUserIsNew, signOutUser };

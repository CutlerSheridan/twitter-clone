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
  where,
  orderBy,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
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
          transaction.update(docRef, {
            joinDate: serverTimestamp(),
            following: [userAuth.uid],
          });
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
const getUserInfoFromHandle = async (handle) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'users'), where('handle', '==', handle))
    );
    let userData;
    querySnapshot.forEach((doc) => (userData = doc.data()));
    return userData;
  } catch (e) {
    console.error(e);
  }
};
const getUsersAndTweets = async (userIds, includeReplies = true) => {
  try {
    const usersAndTweets = [];
    for (let i = 0; i < userIds.length; i++) {
      const id = userIds[i];
      const userInfo = await getUserInfo(id);
      const tweets = await getUserTweets(id, includeReplies);
      tweets.forEach((tweet) => {
        usersAndTweets.push({ tweet, userInfo });
      });
    }

    usersAndTweets.sort((x, y) => y.tweet.creationDate - x.tweet.creationDate);
    return usersAndTweets;
  } catch (e) {
    console.error(e);
  }
};
const getUserTweets = async (userId, includeReplies = true) => {
  let querySnapshot;
  if (includeReplies) {
    querySnapshot = await getDocs(
      query(
        collection(db, 'users', userId, 'tweets'),
        orderBy('creationDate', 'desc')
      )
    );
  } else {
    querySnapshot = await getDocs(
      query(
        collection(db, 'users', userId, 'tweets'),
        where('isReply', '==', false),
        orderBy('creationDate', 'desc')
      )
    );
  }
  const tweetsArray = [];
  querySnapshot.forEach((tweet) => {
    tweetsArray.push(tweet.data());
  });
  return tweetsArray;
};
const followUser = (currentUserId, otherUserId) => {
  try {
    runTransaction(db, async (transaction) => {
      const currentUserDocRef = doc(db, 'users', currentUserId);
      const otherUserDocRef = doc(db, 'users', otherUserId);
      transaction.update(currentUserDocRef, {
        following: arrayUnion(otherUserId),
      });
      transaction.update(otherUserDocRef, {
        followers: arrayUnion(currentUserId),
      });
    });
  } catch (e) {
    console.error(e);
  }
};
const unfollowUser = (currentUserId, otherUserId) => {
  try {
    runTransaction(db, async (transaction) => {
      const currentUserDocRef = doc(db, 'users', currentUserId);
      const otherUserDocRef = doc(db, 'users', otherUserId);
      transaction.update(currentUserDocRef, {
        following: arrayRemove(otherUserId),
      });
      transaction.update(otherUserDocRef, {
        followers: arrayRemove(currentUserId),
      });
    });
  } catch (e) {
    console.error(e);
  }
};
const updateUserFields = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'users')));
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        // followers: [],
        // following: [],
        // bookmarks: [],
        // mentions: [],
      });
    });
  } catch (e) {
    console.error(e);
  }
};
const updateTweetFields = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'users', userId, 'tweets'),
        orderBy('creationDate', 'desc')
      )
    );
    querySnapshot.forEach(async (tweetDoc) => {
      // await updateDoc(tweetDoc.ref, {
      //   retweets: [],
      //   replies: [],
      //   likes: [],
      //   images: [],
      //   quotes: [],
      //   isQuoteTweet: false,
      //   isReply: false,
      //   isRetweet: false,
      //   links: [],
      //   otherUsersMentioned: [],
      //   quotedTweet: null,
      //   repliedToTweet: null,
      //   sentBy: userId,
      // });
      const tweetData = tweetDoc.data();
      if (!tweetData.id && tweetData.tweetId) {
        await updateDoc(tweetDoc.ref, {
          id: tweetData.tweetId,
          tweetId: deleteField(),
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
};
const addTweetToDatabase = async (userId, tweet) => {
  try {
    await runTransaction(db, async (transaction) => {
      const docRef = doc(collection(db, 'users', userId, 'tweets'));
      transaction.set(docRef, tweet);
      if (!tweet.creationDate) {
        transaction.update(docRef, { creationDate: serverTimestamp() });
      }
      if (!tweet.id) {
        transaction.update(docRef, { id: docRef.id });
      }
    });
  } catch (e) {
    console.error('Transaction failed: ', e);
  }
};
const likeTweet = async (userId, tweeterId, tweetId) => {
  const tweetRef = doc(db, 'users', tweeterId, 'tweets', tweetId);
  await updateDoc(tweetRef, {
    likes: arrayUnion(userId),
  });
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    likes: arrayUnion({ tweetId, sentBy: tweeterId }),
  });
};
const unlikeTweet = async (userId, tweeterId, tweetId) => {
  const tweetRef = doc(db, 'users', tweeterId, 'tweets', tweetId);
  await updateDoc(tweetRef, {
    likes: arrayRemove(userId),
  });
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    likes: arrayRemove({ tweetId, sentBy: tweeterId }),
  });
};
const deleteTweet = async (userId, tweetId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'tweets', tweetId));
  } catch (e) {
    console.error(e);
  }
};

export {
  auth,
  signInWithGoogle,
  checkIfUserIsNew,
  signOutUser,
  getUserInfo,
  getUserInfoFromHandle,
  getUserTweets,
  getUsersAndTweets,
  followUser,
  unfollowUser,
  addTweetToDatabase,
  deleteTweet,
  likeTweet,
  unlikeTweet,
  updateUserFields,
  updateTweetFields,
};
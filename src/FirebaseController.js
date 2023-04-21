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
          let handle;
          do {
            handle = createRandomHandle();
          } while (!(await isHandleAvailable(handle)));
          transaction.update(docRef, {
            joinDate: serverTimestamp(),
            following: [userAuth.uid],
            handle: handle,
          });
        }
      });
    } catch (e) {
      console.error('Transaction failed: ', e);
    }
  }
};
const createRandomHandle = () => {
  let newHandle = 'newuser';
  const charOptions = Array.from('1234567890abcdefghijklmnopqrstuvwxyz');
  newHandle += charOptions[Math.floor(Math.random() * 10)];
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * 36);
    newHandle += charOptions[randomIndex];
  }
  return newHandle;
};
const _testRandomHandleGen = () => {
  let testArray = [];
  for (let i = 0; i < 10000; i++) {
    testArray.push(createRandomHandle());
  }
  testArray = testArray.map((x) => x.slice(8));
  const charCount = testArray.reduce((accumulator, x) => {
    [...x].forEach((y) => {
      if (!accumulator[y]) {
        accumulator[y] = 1;
      } else {
        accumulator[y]++;
      }
    });
    return accumulator;
  }, {});
};
// _testRandomHandleGen();

const isHandleAvailable = async (newHandle) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'users'), where('handle', '==', newHandle))
    );
    return !querySnapshot.docs.length;
  } catch (e) {
    console.error(e);
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
const getUsersList = async (userIdsArray) => {
  const userObjs = [];
  for (let i = 0; i < userIdsArray.length; i++) {
    userObjs.push(await getUserInfo(userIdsArray[i]));
  }
  return userObjs;
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
const getTweet = async ({ tweetId, userId }) => {
  const tweetInfo = (
    await getDoc(doc(db, 'users', userId, 'tweets', tweetId))
  ).data();
  return tweetInfo;
};
const getTweetAndUser = async ({ tweetId, userId }) => {
  const userInfo = (await getDoc(doc(db, 'users', userId))).data();
  let tweetInfo = (
    await getDoc(doc(db, 'users', userId, 'tweets', tweetId))
  ).data();
  return { userInfo, tweetInfo };
};
const getSpecificTweets = async (tweetAndUserIds) => {
  try {
    const usersAndTweets = [];
    await runTransaction(db, async (transaction) => {
      for (const item of tweetAndUserIds) {
        const { tweetId, sentBy, userId } = item;
        let userRef, tweetRef;
        if (sentBy) {
          userRef = doc(db, 'users', sentBy);
          tweetRef = doc(db, 'users', sentBy, 'tweets', tweetId);
        } else if (userId) {
          userRef = doc(db, 'users', userId);
          tweetRef = doc(db, 'users', userId, 'tweets', tweetId);
        }
        const userInfo = (await transaction.get(userRef)).data();
        const tweetInfo = (await transaction.get(tweetRef)).data();
        usersAndTweets.push({ tweetInfo, userInfo });
      }
    });
    return usersAndTweets.reverse();
  } catch (e) {
    console.error(e);
  }
};
const getThreadTweetsAndUsers = async ({
  replies,
  prevTweetAndUserIdObj,
  currentUserInfo: originalTweeter,
}) => {
  let replyTweetsAndUsersInfo = (await getSpecificTweets(replies)).reverse();
  let prevTweetsAndUsers = [];
  let needPrevTweet = prevTweetAndUserIdObj ? true : false;
  let prevTweetId, prevUserId;
  if (needPrevTweet) {
    prevTweetId = prevTweetAndUserIdObj.tweetId;
    prevUserId = prevTweetAndUserIdObj.userId;
  }
  while (needPrevTweet) {
    let tweetAndUserInfo;
    if (prevTweetId === originalTweeter.id) {
      tweetAndUserInfo = {
        userInfo: originalTweeter,
        tweetInfo: await getTweet({ userId: prevUserId, tweetId: prevTweetId }),
      };
    } else {
      tweetAndUserInfo = await getTweetAndUser({
        userId: prevUserId,
        tweetId: prevTweetId,
      });
    }
    const tweetInfo = tweetAndUserInfo.tweetInfo;
    const userInfo = tweetAndUserInfo.userInfo;
    prevTweetsAndUsers.push({ tweetInfo, userInfo });
    if (tweetInfo.isReply) {
      prevTweetId = tweetInfo.repliedToTweet.tweetId;
      prevUserId = tweetInfo.repliedToTweet.userId;
    } else {
      needPrevTweet = false;
    }
  }
  prevTweetsAndUsers = prevTweetsAndUsers.reverse();

  let futureThreadsArray = [];
  let bigTweetRepliesFromCurrentUser = [];
  for (let i = replyTweetsAndUsersInfo.length - 1; i >= 0; i--) {
    if (replyTweetsAndUsersInfo[i].userInfo.id === originalTweeter.id) {
      bigTweetRepliesFromCurrentUser.push(
        ...replyTweetsAndUsersInfo.splice(i, 1)
      );
    }
  }
  if (bigTweetRepliesFromCurrentUser.length) {
    for (let i = 0; i < bigTweetRepliesFromCurrentUser.length; i++) {
      const currentReply = bigTweetRepliesFromCurrentUser[i];
      futureThreadsArray.push([currentReply]);
      let needNextTweet = currentReply.tweetInfo.replies.some(
        (x) => x.userId === originalTweeter.id
      );
      let nextUserId, nextTweetId;
      if (needNextTweet) {
        // assuing oldest thread should come first
        const nextIds = currentReply.tweetInfo.replies.find(
          (y) => y.userId === originalTweeter.id
        );
        nextUserId = nextIds.userId;
        nextTweetId = nextIds.tweetId;
      }
      while (needNextTweet) {
        const userInfo = originalTweeter;
        const tweetInfo = await getTweet({
          userId: nextUserId,
          tweetId: nextTweetId,
        });
        futureThreadsArray[i].push({ userInfo, tweetInfo });
        needNextTweet = tweetInfo.replies.some(
          (x) => x.userId === originalTweeter.id
        );
        if (needNextTweet) {
          const nextIds = tweetInfo.replies.find(
            (x) => x.userId === originalTweeter.id
          );
          nextUserId = nextIds.userId;
          nextTweetId = nextIds.tweetId;
        }
      }
    }
  }
  futureThreadsArray = futureThreadsArray.reverse();

  return {
    previousTweetsAndUsersInfo: prevTweetsAndUsers,
    replyTweetsAndUsersInfo,
    futureThreadsArray,
  };
};
const updateUserFields = async (userId, updatesObj) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, updatesObj);
  } catch (e) {
    console.error(e);
  }
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
const devAddUserFields = async () => {
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
    let docRef;
    await runTransaction(db, async (transaction) => {
      docRef = doc(collection(db, 'users', userId, 'tweets'));
      transaction.set(docRef, tweet);
      if (!tweet.creationDate) {
        transaction.update(docRef, { creationDate: serverTimestamp() });
      }
      if (!tweet.id) {
        transaction.update(docRef, { id: docRef.id });
      }
    });
    if (tweet.isReply) {
      const { userId: repliedToUserId, tweetId: repliedToTweetId } =
        tweet.repliedToTweet;
      const repliedToTweetRef = doc(
        db,
        'users',
        repliedToUserId,
        'tweets',
        repliedToTweetId
      );
      await updateDoc(repliedToTweetRef, {
        replies: arrayUnion({
          userId,
          tweetId: docRef.id,
        }),
      });
    }
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
  isHandleAvailable,
  signOutUser,
  getUserInfo,
  getUserInfoFromHandle,
  getUsersList,
  getUserTweets,
  getUsersAndTweets,
  getTweetAndUser,
  getSpecificTweets,
  getThreadTweetsAndUsers,
  updateUserFields,
  followUser,
  unfollowUser,
  addTweetToDatabase,
  deleteTweet,
  likeTweet,
  unlikeTweet,
  devAddUserFields,
  updateTweetFields,
};

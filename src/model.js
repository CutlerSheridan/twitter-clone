const User = (userAuth) => {
  let { uid: id, email } = userAuth;
  return {
    id,
    email,
    displayName: 'New User',
    avi: userAuth.photoURL || null,
    banner: null,
    bio: null,
    joinDate: null,
    following: [],
    followers: [],
    isPrivate: false,
    pinnedTweet: null,
  };
};

export { User };

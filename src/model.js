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
    isPrivate: false,
    pinnedTweet: null,
    location: null,
    likes: [], // {tweetId, userId}
    followers: [],
    following: [],
    bookmarks: [],
    mentions: [],
    // joinDate (timestamped when added to db)

    // DB COLLECTIONS ADDED LATER
    // tweets
    //// tweetId
    ////// {tweet info}
    // directMessages
  };
};
const GuestUser = () => {
  return {
    id: 'guest',
    likes: [],
    followers: [],
    following: [],
    bookmarks: [],
    mentions: [],
  };
};

const Tweet = ({
  tweet,
  sentBy,
  images = [],
  isRetweet = false,
  isReply = false,
  repliedToTweet = null, // {userId, tweetId}
  isQuoteTweet = false,
  quotedTweet = null,
  links = [],
  otherUsersMentioned = [],
  creationDate = null,
  id = null,
  replies = [], // {userId, tweetId}
  likes = [], // userId
  retweets = [],
  quotes = [],
}) => {
  return {
    tweet,
    sentBy,
    images,
    isRetweet,
    isReply,
    repliedToTweet,
    isQuoteTweet,
    quotedTweet,
    links,
    otherUsersMentioned,
    creationDate,
    id,
    replies,
    likes,
    retweets,
    quotes,
    // dateSent (use serverTimeStamp)
    // retweetedDate
  };
};

export { User, GuestUser, Tweet };

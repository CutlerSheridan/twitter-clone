import './TweetCard.css';
import { UserContext } from '../../UserContext';
import { useContext, useEffect, useState } from 'react';
import { deleteTweet, getUserInfo } from '../../FirebaseController';

const TweetCard = ({ tweet, userInfo: tweeterInfo = null }) => {
  const userAuth = useContext(UserContext);
  const creationMilliseconds = tweet.creationDate.seconds * 1000;
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const updateCurrentUser = async () => {
      if (!currentUserInfo) {
        const fetchedUser = await getUserInfo(userAuth.uid);
        setCurrentUserInfo(fetchedUser);
      }
    };
    updateCurrentUser();
  }, []);
  useEffect(() => {
    if (currentUserInfo && tweet.id) {
      console.log('currentUserInfo', currentUserInfo);
      if (
        currentUserInfo.likes.some(
          (x) => x.userId === tweeterInfo.id && x.tweetId === tweet.id
        )
      ) {
        setIsLiked(true);
      }
    }
  }, [currentUserInfo]);

  return (
    <div className="tweetCard-wrapper">
      <div className="tweetCard-middleRow">
        <div className="tweetCard-avi"></div>
        <div className="tweetCard-tweetAndUserWrapper">
          <div className="tweetCard-nameAndHandleWrapper">
            <div className="tweetCard-displayName">
              {tweeterInfo ? tweeterInfo.displayName : 'no user'}
            </div>
            <div className="tweetCard-handleAndDate">
              {tweeterInfo ? '@' + tweeterInfo.handle : 'no handle'} ·{' '}
              {new Date(creationMilliseconds).toDateString()}
              {tweeterInfo.id === userAuth.uid ? (
                <button
                  className="tweetCard-delete"
                  onClick={() => {
                    deleteTweet(
                      tweeterInfo.id,
                      tweet.id ? tweet.id : tweet.tweetId
                    ).then(() => {
                      window.location.reload();
                    });
                  }}
                >
                  X
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="tweetCard-tweet">{tweet.tweet}</div>
        </div>
      </div>
      <div className="tweetCard-bottomRow">
        <div className="tweetCard-actionAndStats">
          <div>Reply</div>
          <div>{tweet.replies.length}</div>
        </div>
        <div className="tweetCard-actionAndStats">
          <div>Retweet</div>
          <div>{tweet.retweets.length}</div>
        </div>
        <div className="tweetCard-actionAndStats">
          <div className={`${isLiked ? 'tweetCard-liked' : ''}`}>♥</div>
          <div>{tweet.likes.length}</div>
        </div>
        <div>Share</div>
      </div>
    </div>
  );
};

export default TweetCard;

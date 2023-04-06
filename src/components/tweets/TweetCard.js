import './TweetCard.css';
import { UserContext } from '../../UserContext';
import { useContext, useEffect, useState } from 'react';
import {
  deleteTweet,
  getUserInfo,
  likeTweet,
  unlikeTweet,
} from '../../FirebaseController';
import { Link } from 'react-router-dom';

const TweetCard = ({
  tweet,
  userInfo: tweeterInfo = null,
  currentUserInfo,
}) => {
  const userAuth = useContext(UserContext);
  const creationMilliseconds = tweet.creationDate.seconds * 1000;
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(tweet.likes.length);

  useEffect(() => {
    if (currentUserInfo && tweet.id) {
      if (
        currentUserInfo.likes.some(
          (x) => x.sentBy === tweeterInfo.id && x.tweetId === tweet.id
        )
      ) {
        setIsLiked(true);
      }
    }
  }, []);

  const handleLikeButton = () => {
    if (isLiked) {
      setIsLiked(false);
      setNumOfLikes((prev) => --prev);
      unlikeTweet(currentUserInfo.id, tweeterInfo.id, tweet.id);
    } else {
      setIsLiked(true);
      setNumOfLikes((prev) => ++prev);
      likeTweet(currentUserInfo.id, tweeterInfo.id, tweet.id);
    }
  };

  return (
    <div className="tweetCard-wrapper">
      <div className="tweetCard-middleRow">
        <img src={tweeterInfo.avi} className="tweetCard-avi"></img>
        <div className="tweetCard-tweetAndUserWrapper">
          {tweeterInfo ? (
            <Link to={`/${tweeterInfo.handle}`}>
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
                        deleteTweet(tweeterInfo.id, tweet.id).then(() => {
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
            </Link>
          ) : (
            <div className="tweetCard-nameAndHandleWrapper-empty">...</div>
          )}
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
        <div className="tweetCard-actionAndStats tweetCard-likeWrapper">
          <button
            className={`tweetCard-likeButton ${
              isLiked ? 'tweetCard-likeButton-liked' : ''
            }`}
            onClick={() => handleLikeButton()}
          >
            ♥
          </button>
          <div>{numOfLikes}</div>
        </div>
        <div>Share</div>
      </div>
    </div>
  );
};

export default TweetCard;

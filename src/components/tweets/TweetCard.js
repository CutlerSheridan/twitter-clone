import './TweetCard.css';
import { UserContext } from '../../UserContext';
import { useContext, useEffect, useState } from 'react';
import { deleteTweet, likeTweet, unlikeTweet } from '../../FirebaseController';
import { Link } from 'react-router-dom';

const TweetCard = ({
  tweet: tweetInfo,
  userInfo: tweeterInfo = null,
  currentUserInfo,
}) => {
  const userAuth = useContext(UserContext);
  const creationMilliseconds = tweetInfo.creationDate.seconds * 1000;
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(tweetInfo.likes.length);

  useEffect(() => {
    if (currentUserInfo && tweetInfo.id) {
      if (
        currentUserInfo.likes.some(
          (x) => x.sentBy === tweeterInfo.id && x.tweetId === tweetInfo.id
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
      unlikeTweet(currentUserInfo.id, tweeterInfo.id, tweetInfo.id);
    } else {
      setIsLiked(true);
      setNumOfLikes((prev) => ++prev);
      likeTweet(currentUserInfo.id, tweeterInfo.id, tweetInfo.id);
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
                        deleteTweet(tweeterInfo.id, tweetInfo.id).then(() => {
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
          <Link to={`tweet/${tweeterInfo.id}-${tweetInfo.id}`}>
            <div className="tweetCard-tweet">{tweetInfo.tweet}</div>
          </Link>
        </div>
      </div>
      <div className="tweetCard-bottomRow">
        <div className="tweetCard-actionAndStats">
          <div>Reply</div>
          <div>{tweetInfo.replies.length}</div>
        </div>
        <div className="tweetCard-actionAndStats">
          <div>Retweet</div>
          <div>{tweetInfo.retweets.length}</div>
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

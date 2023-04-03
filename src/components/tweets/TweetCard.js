import './TweetCard.css';
import { UserContext } from '../../UserContext';
import { useContext } from 'react';
import { deleteTweet } from '../../FirebaseController';

const TweetCard = ({ tweet, userInfo = null }) => {
  const userAuth = useContext(UserContext);
  const creationMilliseconds = tweet.creationDate.seconds * 1000;

  return (
    <div className="tweetCard-wrapper">
      <div className="tweetCard-middleRow">
        <div className="tweetCard-avi"></div>
        <div className="tweetCard-tweetAndUserWrapper">
          <div className="tweetCard-nameAndHandleWrapper">
            <div className="tweetCard-displayName">
              {userInfo ? userInfo.displayName : 'no user'}
            </div>
            <div className="tweetCard-handleAndDate">
              {userInfo ? '@' + userInfo.handle : 'no handle'} ·{' '}
              {new Date(creationMilliseconds).toDateString()}
              {userInfo.id === userAuth.uid ? (
                <button
                  className="tweetCard-delete"
                  onClick={() => {
                    deleteTweet(
                      userInfo.id,
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
        <div>Reply</div>
        <div>Retweet</div>
        <div>Like</div>
        <div>Share</div>
      </div>
    </div>
  );
};

export default TweetCard;

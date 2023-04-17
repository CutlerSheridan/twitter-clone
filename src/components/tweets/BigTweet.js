import './BigTweet.css';
import {
  useLocation,
  useNavigate,
  useParams,
  Link,
  Outlet,
} from 'react-router-dom';
import {
  getTweetAndUser,
  getUserInfo,
  deleteTweet,
  likeTweet,
  unlikeTweet,
  getThreadTweetsAndUsers,
} from '../../FirebaseController';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import ComposeTweet from './ComposeTweet';
import TweetFeed from './TweetFeed';

const BigTweet = (props) => {
  const { isPartOfPopupReply } = props;
  const { userIdTweetId } = useParams();
  let userId, tweetId;
  if (userIdTweetId && !isPartOfPopupReply) {
    [userId, tweetId] = userIdTweetId.split('-');
  } else {
    userId = props.userId;
    tweetId = props.tweetId;
  }
  const userAuth = useContext(UserContext);
  const [tweeterInfo, setTweeterInfo] = useState(null);
  const [tweetInfo, setTweetInfo] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(0);
  const [repliesAndPrevTweets, setRepliesAndPrevTweets] = useState({});
  const [userReplyingTo, setUserReplyingTo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTweetAndUser({ userId, tweetId }).then((result) => {
      setTweetInfo(result.tweetInfo);
      setTweeterInfo(result.userInfo);
    });
    if (userAuth) {
      getUserInfo(userAuth.uid).then(setCurrentUserInfo);
    }
  }, [userAuth]);
  useEffect(() => {
    if (currentUserInfo) {
      setIsLiked(currentUserInfo.likes.some((x) => x === tweetId));
    }
  }, [currentUserInfo]);
  useEffect(() => {
    const fetchPrevTweetsAndReplies = async () => {
      const tweetObjs = await getThreadTweetsAndUsers({
        replies: tweetInfo.replies,
        prevTweetAndUserIdObj: tweetInfo.repliedToTweet,
      });
      setRepliesAndPrevTweets(tweetObjs);
    };
    if (tweetInfo) {
      setNumOfLikes(tweetInfo.likes.length);
      fetchPrevTweetsAndReplies();
      if (tweetInfo.isReply) {
        getUserInfo(tweetInfo.repliedToTweet.userId).then((result) => {
          setUserReplyingTo(result.handle);
        });
      }
    }
  }, [tweetInfo]);

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

  const goBack = () => {
    navigate(-1);
  };

  return tweetInfo && tweeterInfo && currentUserInfo ? (
    <div className="bigTweet-wrapper">
      {tweetInfo.isReply && repliesAndPrevTweets ? (
        <TweetFeed
          tweetAndUserInfoArray={
            repliesAndPrevTweets.previousTweetsAndUsersInfo
          }
          includeReplies={true}
          currentUserInfo={currentUserInfo}
        />
      ) : (
        <></>
      )}
      <section className="bigTweet-innerContainer">
        <div className="bigTweet-header">
          {isPartOfPopupReply ? <></> : <button onClick={goBack}>{'<'}</button>}
          <h1>Tweet</h1>
        </div>
        <div className="bigTweet-tweetWrapper">
          <div className="bigTweet-middleRow">
            <img
              src={tweeterInfo.avi}
              className="bigTweet-avi"
              referrerPolicy="no-referrer"
            ></img>
            {tweeterInfo ? (
              <div className="bigTweet-nameAndHandleWrapper">
                <Link to={`/${tweeterInfo.handle}`}>
                  <div className="bigTweet-displayName">
                    {tweeterInfo ? tweeterInfo.displayName : 'no user'}
                  </div>
                  <div className="bigTweet-handle">
                    {tweeterInfo ? '@' + tweeterInfo.handle : 'loading...'}
                    {tweeterInfo.id === userAuth.uid ? (
                      <button
                        className="bigTweet-delete"
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
                </Link>
              </div>
            ) : (
              <div className="bigTweet-nameAndHandleWrapper-empty">...</div>
            )}
          </div>
          <div className="bigTweet-tweet">{tweetInfo.tweet}</div>
          <div className="bigTweet-timestamp">
            {new Date(tweetInfo.creationDate.seconds * 1000).toLocaleTimeString(
              undefined,
              { hour: 'numeric', minute: 'numeric' }
            )}
            {' • '}
            {new Date(tweetInfo.creationDate.seconds * 1000).toLocaleDateString(
              undefined,
              { month: 'short', day: 'numeric', year: 'numeric' }
            )}
          </div>
          {tweetInfo.isReply ? (
            <div className="bigTweet-replyLabel">
              Replying to{' '}
              <Link to={`../${userReplyingTo}`}>@{userReplyingTo}</Link>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="bigTweet-divider"></div>

        <div className="bigTweet-statsRow">
          <div className="bigTweet-stat">
            {tweetInfo.replies.length} <span>Replies</span>
          </div>
          <div className="bigTweet-stat">
            {tweetInfo.retweets.length} <span>Retweets</span>
          </div>
          <div className="bigTweet-stat bigTweet-stat-likes">
            <Link
              to="./likes"
              state={{ userIds: tweetInfo.likes.reverse(), title: 'Likes' }}
            >
              {numOfLikes} <span>Likes</span>
            </Link>
          </div>
        </div>

        <div className="bigTweet-divider"></div>

        <div className="bigTweet-actionsRow">
          <div className="bigTweet-action">
            <div>Reply</div>
          </div>
          <div className="bigTweet-action">
            <div>Retweet</div>
          </div>
          <div className="bigTweet-action">
            <button
              className={`bigTweet-likeButton ${
                isLiked ? 'bigTweet-likeButton-liked' : ''
              }`}
              onClick={() => handleLikeButton()}
            >
              ♥
            </button>
          </div>
          <div>Share</div>
        </div>
        {isPartOfPopupReply ? (
          <></>
        ) : (
          <div>
            <ComposeTweet repliedToIdsObj={{ userId, tweetId }} />
            {tweetInfo.replies.length && repliesAndPrevTweets ? (
              <TweetFeed
                tweetAndUserInfoArray={
                  repliesAndPrevTweets.replyTweetsAndUsersInfo
                }
                includeReplies={true}
                currentUserInfo={currentUserInfo}
              />
            ) : (
              <></>
            )}
          </div>
        )}

        <Outlet />
      </section>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default BigTweet;

import './BigTweet.css';
import { useNavigate, useParams, Link, Outlet } from 'react-router-dom';
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
import ComposeTweetPopUp from './ComposeTweetPopUp';
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
  const [threadTweets, setThreadTweets] = useState(null);
  const [userReplyingTo, setUserReplyingTo] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [replying, setReplying] = useState(false);
  const [showingDeleteButton, setShowingDeleteButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getTweetAndUser({ userId, tweetId }).then((result) => {
      if (!result.tweetInfo) {
        setIsDeleted(true);
      } else {
        setTweetInfo(result.tweetInfo);
        setTweeterInfo(result.userInfo);
      }
    });
    if (userAuth) {
      getUserInfo(userAuth.uid).then(setCurrentUserInfo);
    }
  }, [userAuth, userId, tweetId]);
  useEffect(() => {
    if (currentUserInfo) {
      setIsLiked(currentUserInfo.likes.some((x) => x === tweetId));
    }
  }, [currentUserInfo]);
  useEffect(() => {
    if (!isDeleted && tweeterInfo) {
      const fetchPrevTweetsAndReplies = async () => {
        const tweetObjs = await getThreadTweetsAndUsers({
          replies: tweetInfo.replies,
          prevTweetAndUserIdObj: tweetInfo.repliedToTweet,
          currentUserInfo: tweeterInfo,
        });
        setThreadTweets(tweetObjs);
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
    }
  }, [tweetInfo, tweeterInfo]);

  const launchReplyPopup = () => {
    setReplying(true);
  };
  const exitReplyPopup = () => {
    setReplying(false);
  };
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
  const showDeleteButton = (e) => {
    e.preventDefault();
    setShowingDeleteButton(true);
    e.stopPropagation();
    document.addEventListener('click', hideDeleteButton);
  };
  const hideDeleteButton = () => {
    setShowingDeleteButton(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `cutlersheridan.github.io/twitter-clone/tweet/${tweeterInfo.id}-${tweetInfo.id}`
    );
    const copiedIndicator = document.querySelector(
      `.alert-textCopied-${tweeterInfo.id}_${tweetInfo.id}`
    );
    copiedIndicator.classList.add('alert-textCopied-visible');
    setTimeout(() => {
      copiedIndicator.classList.remove('alert-textCopied-visible');
    }, 850);
  };

  if (isDeleted) {
    return (
      <div className="bigTweet-wrapper bigTweet-wrapper-deleted">
        This tweet has been deleted by its author.
      </div>
    );
  } else {
    return tweetInfo && tweeterInfo && currentUserInfo ? (
      <div className="bigTweet-wrapper">
        <section className="bigTweet-innerContainer">
          <div className="bigTweet-header">
            {isPartOfPopupReply ? (
              <></>
            ) : (
              <button className="bigTweet-backButton" onClick={goBack}>
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <h1>Tweet</h1>
          </div>
          {tweetInfo.isReply && threadTweets ? (
            <TweetFeed
              tweetAndUserInfoArray={threadTweets.previousTweetsAndUsersInfo}
              includeReplies={true}
              currentUserInfo={currentUserInfo}
            />
          ) : (
            <></>
          )}

          <div className="bigTweet-tweetWrapper">
            <div className="bigTweet-divider"></div>
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
                        <div className="bigTweet-deleteContainer">
                          <div
                            type="button"
                            onClick={showDeleteButton}
                            className={`bigTweet-preDelete ${
                              showingDeleteButton
                                ? 'bigTweet-preDelete-hidden'
                                : ''
                            }`}
                          >
                            <span className="material-symbols-outlined">
                              more_horiz
                            </span>
                          </div>
                          <button
                            className={`bigTweet-delete ${
                              showingDeleteButton
                                ? ''
                                : 'bigTweet-delete-hidden'
                            }`}
                            onClick={() => {
                              deleteTweet(tweeterInfo.id, tweetInfo.id).then(
                                () => {
                                  window.location.reload();
                                }
                              );
                            }}
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </div>
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
              {new Date(
                tweetInfo.creationDate.seconds * 1000
              ).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
              })}
              {' • '}
              {new Date(
                tweetInfo.creationDate.seconds * 1000
              ).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
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
            {isPartOfPopupReply ? (
              <></>
            ) : (
              <button className="bigTweet-action" onClick={launchReplyPopup}>
                <span className="material-symbols-outlined">chat_bubble</span>
              </button>
            )}
            <button className="bigTweet-action">
              <span className="material-symbols-outlined">laps</span>
            </button>
            <div className="bigTweet-action">
              <button
                className={`bigTweet-action bigTweet-likeButton ${
                  isLiked ? 'bigTweet-likeButton-liked' : ''
                }`}
                onClick={() => handleLikeButton()}
              >
                ♥
              </button>
            </div>
            <div className="bigTweet-actionWrapper">
              <button className="bigTweet-action" onClick={copyLink}>
                <span className="material-symbols-outlined">ios_share</span>
              </button>
              <div
                className={`alert-textCopied alert-textCopied-${userId}_${tweetId}`}
              >
                URL copied!
              </div>
            </div>
          </div>
          {isPartOfPopupReply ? (
            <></>
          ) : (
            <div>
              {replying ? (
                <ComposeTweetPopUp
                  repliedToIdsObj={{
                    userId: tweeterInfo.id,
                    tweetId: tweetInfo.id,
                  }}
                  handleExit={exitReplyPopup}
                />
              ) : (
                <></>
              )}
              {tweetInfo.replies.length && threadTweets ? (
                <div>
                  {threadTweets.futureThreadsArray.map((x) => (
                    <TweetFeed
                      tweetAndUserInfoArray={x}
                      includeReplies={true}
                      currentUserInfo={tweeterInfo}
                      key={`${Math.random()}` + `${Math.random()}`}
                    />
                  ))}
                  <TweetFeed
                    tweetAndUserInfoArray={threadTweets.replyTweetsAndUsersInfo}
                    includeReplies={true}
                    currentUserInfo={currentUserInfo}
                  />
                </div>
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
  }
};

export default BigTweet;

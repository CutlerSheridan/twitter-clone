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
import ComposeTweetPopUp from './ComposeTweetPopUp';

const TweetCard = ({
  tweet: tweetInfo,
  userInfo: tweeterInfo = null,
  currentUserInfo = {},
  threadLines = 'none',
}) => {
  const userAuth = useContext(UserContext);
  const creationMilliseconds = tweetInfo
    ? tweetInfo.creationDate.seconds * 1000
    : null;
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(
    tweetInfo ? tweetInfo.likes.length : null
  );
  const [replying, setReplying] = useState(false);
  const [userReplyingTo, setUserReplyingTo] = useState(null);
  const [isDeleted] = useState(!tweetInfo);
  const [showingDeleteButton, setShowingDeleteButton] = useState(false);

  useEffect(() => {
    if (!isDeleted) {
      if (userAuth && currentUserInfo && tweetInfo.id) {
        if (
          currentUserInfo.likes.some(
            (x) => x.sentBy === tweeterInfo.id && x.tweetId === tweetInfo.id
          )
        ) {
          setIsLiked(true);
        }
      }
      if (tweetInfo && tweetInfo.isReply && !userReplyingTo) {
        getUserInfo(tweetInfo.repliedToTweet.userId).then((result) => {
          setUserReplyingTo(result.handle);
        });
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

  const launchReplyPopup = () => {
    setReplying(true);
  };
  const exitReplyPopup = () => {
    setReplying(false);
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
  const showDeleteButton = (e) => {
    e.preventDefault();
    setShowingDeleteButton(true);
    e.stopPropagation();
    document.addEventListener('click', hideDeleteButton);
  };
  const hideDeleteButton = () => {
    setShowingDeleteButton(false);
  };

  return isDeleted ? (
    <div className="tweetCard-wrapper tweetCard-wrapper-deleted">
      This tweet has been deleted by its author.
    </div>
  ) : (
    <div className={`tweetCard-wrapper tweetCard-lines-${threadLines}`}>
      <div className="tweetCard-middleRow">
        <img
          src={tweeterInfo.avi}
          className="tweetCard-avi"
          referrerPolicy="no-referrer"
        ></img>
        <div className="tweetCard-tweetAndUserWrapper">
          {tweeterInfo ? (
            <Link to={`/${tweeterInfo.handle}`}>
              <div className="tweetCard-topRow">
                <div className="tweetCard-nameAndHandleWrapper">
                  <div className="tweetCard-displayName">
                    {tweeterInfo ? tweeterInfo.displayName : 'no user'}
                  </div>
                  <div className="tweetCard-handleAndDate">
                    {tweeterInfo ? '@' + tweeterInfo.handle : 'no handle'} ·{' '}
                    {new Date(creationMilliseconds).toLocaleDateString(
                      undefined,
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </div>
                </div>
                {userAuth && tweeterInfo.id === userAuth.uid ? (
                  <div className="tweetCard-deleteContainer">
                    <div
                      type="button"
                      onClick={showDeleteButton}
                      className={`tweetCard-preDelete ${
                        showingDeleteButton ? 'tweetCard-preDelete-hidden' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </div>
                    <button
                      className={`tweetCard-delete ${
                        showingDeleteButton ? '' : 'tweetCard-delete-hidden'
                      }`}
                      onClick={() => {
                        deleteTweet(tweeterInfo.id, tweetInfo.id).then(() => {
                          window.location.reload();
                        });
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Link>
          ) : (
            <div className="tweetCard-nameAndHandleWrapper-empty">...</div>
          )}
          {tweetInfo.isReply ? (
            <div className="tweetCard-replyLabel">
              Replying to{' '}
              {userReplyingTo ? (
                <Link to={`/${userReplyingTo}`}>@{userReplyingTo}</Link>
              ) : (
                <>...</>
              )}
            </div>
          ) : (
            <></>
          )}
          <Link to={`/tweet/${tweeterInfo.id}-${tweetInfo.id}`}>
            <div className="tweetCard-tweet">{tweetInfo.tweet}</div>
          </Link>
        </div>
      </div>
      <div className="tweetCard-bottomRow">
        <div className="tweetCard-actionAndStats">
          <button
            className={`tweetCard-action ${
              !userAuth ? 'tweetCard-action-disabled' : ''
            }`}
            onClick={launchReplyPopup}
          >
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <div className="tweetCard-stat">{tweetInfo.replies.length}</div>
        </div>
        <div className="tweetCard-actionAndStats">
          <button
            className={`tweetCard-action tweetCard-action-disabled ${
              !userAuth ? 'tweetCard-action-disabled' : ''
            }`}
          >
            <span className="material-symbols-outlined">laps</span>
          </button>
          <div className="tweetCard-stat">{tweetInfo.retweets.length}</div>
        </div>
        <div className="tweetCard-actionAndStats tweetCard-likeWrapper">
          <button
            className={`tweetCard-action tweetCard-likeButton ${
              isLiked ? 'tweetCard-likeButton-liked' : ''
            } ${!userAuth ? 'tweetCard-action-disabled' : ''}`}
            onClick={() => handleLikeButton()}
          >
            ♥
          </button>
          <div className="tweetCard-stat">{numOfLikes}</div>
        </div>
        <div className="tweetCard-actionAndStats">
          <button className={`tweetCard-action`} onClick={copyLink}>
            <span className="material-symbols-outlined">ios_share</span>
          </button>
          <div
            className={`alert-textCopied alert-textCopied-${tweeterInfo.id}_${tweetInfo.id}`}
          >
            URL copied!
          </div>
        </div>
      </div>
      {replying ? (
        <ComposeTweetPopUp
          repliedToIdsObj={{ userId: tweeterInfo.id, tweetId: tweetInfo.id }}
          handleExit={exitReplyPopup}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TweetCard;

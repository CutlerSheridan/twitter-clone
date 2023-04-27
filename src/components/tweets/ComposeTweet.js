import './ComposeTweet.css';
import { UserContext } from '../../UserContext';
import { useContext, useEffect, useState } from 'react';
import { Tweet } from '../../model';
import { addTweetToDatabase } from '../../FirebaseController';

const ComposeTweet = ({ repliedToIdsObj = null }) => {
  const userAuth = useContext(UserContext);
  const [isReply, setIsReply] = useState(repliedToIdsObj ? true : false);
  const [numOfChars, setNumOfChars] = useState(0);
  const [initialInputHeight, setInitialInputHeight] = useState(0);

  useEffect(() => {
    const inputElement = document.querySelector(
      '.composeTweet-form > textarea'
    );
    inputElement.style.height = inputElement.offsetHeight + 'px';
    setInitialInputHeight(inputElement.offsetHeight);
  }, []);

  const sendTweet = (e) => {
    e.preventDefault();
    const tweetText = e.target[0].value;
    const newTweet = Tweet({
      tweet: tweetText,
      sentBy: userAuth.uid,
    });
    if (isReply) {
      newTweet.isReply = true;
      newTweet.repliedToTweet = {
        userId: repliedToIdsObj.userId,
        tweetId: repliedToIdsObj.tweetId,
      };
    }
    addTweetToDatabase(userAuth.uid, newTweet).then(() => {
      const formElement = document.querySelector('.composeTweet-form');
      formElement.reset();
      window.location.reload();
    });
  };
  const handleTyping = (e) => {
    setNumOfChars(e.target.value.length);
    resizeTextarea(e);
  };
  const resizeTextarea = (e) => {
    if (e.target.offsetHeight > initialInputHeight) {
      e.target.style.height = 'auto';
    }
    if (e.target.scrollHeight >= initialInputHeight) {
      e.target.style.height = e.target.scrollHeight + 'px';
    } else if (e.target.offsetHeight !== initialInputHeight) {
      e.target.style.height = initialInputHeight + 'px';
    }
  };

  return (
    <div className="composeTweet-wrapper">
      <form className="composeTweet-form" onSubmit={sendTweet}>
        <textarea
          rows={3}
          onChange={handleTyping}
          placeholder={isReply ? 'Tweet your reply' : "What's on your mind?"}
          autoFocus
        ></textarea>
        <div className="composeTweet-bottomRow">
          <div
            className={`composeTweet-charCount ${
              numOfChars > 240 ? 'composeTweet-charCount-tooHigh' : ''
            }`}
          >
            {numOfChars}/240
          </div>
          <button type="submit" disabled={numOfChars > 240 ? true : ''}>
            {isReply ? 'Reply' : 'Tweet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComposeTweet;

import './ComposeTweetPopUp.css';
import BigTweet from './BigTweet';
import ComposeTweet from './ComposeTweet';
import { useState } from 'react';

const ComposeTweetPopUp = ({ repliedToIdsObj = null, handleExit }) => {
  const [isReply] = useState(repliedToIdsObj ? true : false);

  return (
    <div
      className={`composePopUp-wrapper ${
        isReply ? 'composePopUp-wrapper-replying' : ''
      }`}
    >
      <div className="composePopUp-background"></div>
      <div className="composePopUp-innerContainer">
        <button onClick={handleExit} className="composePopUp-close">
          <span className="material-symbols-outlined">close</span>
        </button>
        {isReply ? (
          <BigTweet
            userId={repliedToIdsObj.userId}
            tweetId={repliedToIdsObj.tweetId}
            isPartOfPopupReply={true}
          />
        ) : (
          <></>
        )}
        <ComposeTweet repliedToIdsObj={repliedToIdsObj} />
      </div>
    </div>
  );
};

export default ComposeTweetPopUp;

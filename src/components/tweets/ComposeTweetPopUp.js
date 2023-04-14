import './ComposeTweetPopUp.css';
import BigTweet from './BigTweet';
import ComposeTweet from './ComposeTweet';
import { useContext, useState } from 'react';
import { UserContext } from '../../UserContext';

const ComposeTweetPopUp = ({ repliedToIdsObj = null, handleExit }) => {
  const userAuth = useContext(UserContext);
  const [isReply, setIsReply] = useState(repliedToIdsObj ? true : false);

  return (
    <div className="composePopUp-wrapper">
      <div className="composePopUp-innerContainer">
        <button onClick={handleExit}>X</button>
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

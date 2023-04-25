import './ComposeTweet.css';
import { UserContext } from '../../UserContext';
import { useContext, useState } from 'react';
import { Tweet } from '../../model';
import { addTweetToDatabase } from '../../FirebaseController';

const ComposeTweet = ({ repliedToIdsObj = null }) => {
  const userAuth = useContext(UserContext);
  const [isReply, setIsReply] = useState(repliedToIdsObj ? true : false);

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

  return (
    <div className="composeTweet-wrapper">
      <form className="composeTweet-form" onSubmit={sendTweet}>
        <h2>New tweet</h2>
        {isReply ? <div>Replying</div> : <></>}
        <input type="text" maxLength={280}></input>
        <button type="submit">Send tweet</button>
      </form>
    </div>
  );
};

export default ComposeTweet;

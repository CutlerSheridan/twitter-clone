import './ComposeTweet.css';
import { UserContext } from '../../UserContext';
import { useContext } from 'react';
import { Tweet } from '../../model';
import { addTweetToDatabase } from '../../FirebaseController';

const ComposeTweet = () => {
  const userAuth = useContext(UserContext);

  const sendTweet = (e) => {
    // e.preventDefault();
    const tweetText = e.target[0].value;
    const newTweet = Tweet({
      tweet: tweetText,
      sentBy: userAuth.uid,
    });
    addTweetToDatabase(userAuth.uid, newTweet).then(() => {
      const formElement = document.querySelector('.composeTweet-form');
      formElement.reset();
    });
  };

  return (
    <div className="composeTweet-wrapper">
      <form className="composeTweet-form" onSubmit={sendTweet}>
        <h2>New tweet</h2>
        <input maxLength={280}></input>
        <button type="submit">Send tweet</button>
      </form>
    </div>
  );
};

export default ComposeTweet;

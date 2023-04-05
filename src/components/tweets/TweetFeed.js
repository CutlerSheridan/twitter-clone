import './TweetFeed.css';
import TweetCard from './TweetCard';
import { useEffect, useState } from 'react';
import { getUsersAndTweets } from '../../FirebaseController';

const TweetFeed = ({ idsForFeed, includeReplies }) => {
  const [tweetsToDisplay, setTweetsToDisplay] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      if (!tweetsToDisplay.length) {
        const usersAndTweets = await getUsersAndTweets(
          idsForFeed,
          includeReplies
        );
        setTweetsToDisplay(usersAndTweets);
      }
    };
    fetchTweets();
  }, []);

  const createFeed = () => {
    return (
      <div className="feed">
        {tweetsToDisplay.map((x) => (
          <TweetCard
            tweet={x.tweet}
            userInfo={x.userInfo}
            key={`${Math.random()}` + `${Math.random()}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="feed-wrapper">
      {tweetsToDisplay.length ? createFeed() : <></>}
    </section>
  );
};

export default TweetFeed;

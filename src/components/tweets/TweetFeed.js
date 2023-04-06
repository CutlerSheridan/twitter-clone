import './TweetFeed.css';
import TweetCard from './TweetCard';
import { useEffect, useState } from 'react';
import { getUsersAndTweets } from '../../FirebaseController';

const TweetFeed = ({ idsForFeed, includeReplies, currentUserInfo }) => {
  const [tweetsToDisplay, setTweetsToDisplay] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      if (idsForFeed && currentUserInfo) {
        const usersAndTweets = await getUsersAndTweets(
          idsForFeed,
          includeReplies
        );
        setTweetsToDisplay(usersAndTweets);
      }
    };
    fetchTweets();
  }, [idsForFeed]);

  const createFeed = () => {
    return (
      <div className="feed">
        {tweetsToDisplay.map((x) => (
          <TweetCard
            tweet={x.tweet}
            userInfo={x.userInfo}
            currentUserInfo={currentUserInfo}
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

import './TweetFeed.css';
import TweetCard from './TweetCard';
import { useEffect, useState } from 'react';
import { getSpecificTweets, getUsersAndTweets } from '../../FirebaseController';

const TweetFeed = ({
  idsForFeed,
  likes,
  tweetAndUserInfoArray,
  includeReplies,
  currentUserInfo,
  isHomeFeed = false,
}) => {
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
      if (likes && currentUserInfo) {
        const usersAndTweets = await getSpecificTweets(likes);
        setTweetsToDisplay(usersAndTweets);
      }
      if (tweetAndUserInfoArray && currentUserInfo) {
        setTweetsToDisplay(tweetAndUserInfoArray);
      }
    };
    fetchTweets();
  }, [idsForFeed, currentUserInfo, likes, tweetAndUserInfoArray]);

  const createFeed = () => {
    return (
      <div className="feed">
        {tweetsToDisplay.map((x) => (
          <TweetCard
            tweet={x.tweetInfo}
            userInfo={x.userInfo}
            currentUserInfo={currentUserInfo}
            key={`${Math.random()}` + `${Math.random()}`}
          />
        ))}
        {isHomeFeed && !tweetsToDisplay.length && currentUserInfo ? (
          <div className="home-guestMessage">{`Follow users to populate your home feed!\nYou could get started by following @cutler`}</div>
        ) : (
          <></>
        )}
        {isHomeFeed && !currentUserInfo ? (
          <div className="home-guestMessage">Sign in to get started!</div>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <section className="feed-wrapper">
      {tweetsToDisplay ? createFeed() : <></>}
    </section>
  );
};

export default TweetFeed;

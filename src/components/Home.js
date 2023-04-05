import { useContext, useEffect, useState } from 'react';
import { getUserInfo } from '../FirebaseController';
import { UserContext } from '../UserContext';
import './Home.css';
import TweetFeed from './tweets/TweetFeed';

const Home = () => {
  const currentUserAuth = useContext(UserContext);
  const [idsForFeed, setIdsForFeed] = useState([]);

  useEffect(() => {
    if (currentUserAuth && !idsForFeed.length) {
      getUserInfo(currentUserAuth.uid).then((result) => {
        setIdsForFeed(result.following);
      });
    }
  }, [currentUserAuth]);

  return (
    <div className="home-wrapper layout-element">
      {idsForFeed.length ? (
        <TweetFeed idsForFeed={idsForFeed} includeReplies={true} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;

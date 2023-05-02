import { useContext, useEffect, useState } from 'react';
import { getUserInfo } from '../FirebaseController';
import { UserContext } from '../UserContext';
import './Home.css';
import TweetFeed from './tweets/TweetFeed';
import * as model from '../model';

const Home = () => {
  const currentUserAuth = useContext(UserContext);
  const [idsForFeed, setIdsForFeed] = useState([]);
  const [currentUserInfo, setCurrentUserInfo] = useState(model.GuestUser());

  useEffect(() => {
    if (currentUserAuth) {
      getUserInfo(currentUserAuth.uid).then((result) => {
        setIdsForFeed(result.following);
        setCurrentUserInfo(result);
      });
    } else {
      setCurrentUserInfo(model.GuestUser());
      setIdsForFeed([]);
    }
  }, [currentUserAuth]);

  return (
    <div className="home-wrapper layout-element">
      <TweetFeed
        idsForFeed={idsForFeed}
        includeReplies={true}
        currentUserInfo={currentUserInfo}
        isHomeFeed={true}
        needsBottomBorder={true}
        needsCredit={true}
      />
    </div>
  );
};

export default Home;

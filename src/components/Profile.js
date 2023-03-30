import './Profile.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { getUserInfo, getUserTweets } from '../FirebaseController';

const Profile = () => {
  const user = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const newUserInfo = await getUserInfo(user.uid);
        setUserInfo(newUserInfo);
      }
    };
    fetchUserInfo();
  }, [user]);
  useEffect(() => {
    const fetchUserTweets = async () => {
      if (user) {
        const tweetsArray = await getUserTweets(user.uid);
        setUserTweets(tweetsArray);
      }
    };
    fetchUserTweets();
  }, [user]);

  const createHeaderForUser = () => {
    return <div>{userInfo.email}</div>;
  };

  return (
    <div className="profile-wrapper layout-element">
      <h1>Profile</h1>
      {userInfo ? createHeaderForUser() : ''}
      <h2>Tweets</h2>
      {userTweets.map((x) => (
        <div key={Math.random()}>{x.tweet}</div>
      ))}
    </div>
  );
};

export default Profile;

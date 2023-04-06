import './Profile.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import {
  getUserInfo,
  getUserInfoFromHandle,
  getUserTweets,
  followUser,
  unfollowUser,
} from '../FirebaseController';
import TweetCard from './tweets/TweetCard';
import { useParams } from 'react-router-dom';
import TweetFeed from './tweets/TweetFeed';

const Profile = () => {
  const currentUserAuth = useContext(UserContext);
  const { userHandle } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowedBy, setIsFollowedBy] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userHandle) {
        const newUserInfo = await getUserInfoFromHandle(userHandle);
        setUserInfo(newUserInfo);
      }
    };
    fetchUserInfo();
  }, [userHandle]);
  useEffect(() => {
    const fetchUserTweets = async () => {
      if (currentUserAuth && userInfo) {
        const tweetsArray = await getUserTweets(userInfo.id, false);
        setUserTweets(tweetsArray);
      }
    };
    fetchUserTweets();
  }, [userInfo]);
  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      if (userInfo) {
        const info = await getUserInfo(currentUserAuth.uid);
        setCurrentUserInfo(info);
      }
    };
    fetchCurrentUserInfo();
  }, [userTweets]);
  useEffect(() => {
    if (currentUserInfo && userInfo) {
      setIsFollowing(currentUserInfo.following.some((x) => x === userInfo.id));
      setIsFollowedBy(currentUserInfo.followers.some((x) => x === userInfo.id));
    }
  }, [currentUserInfo]);

  const createHeaderForUser = () => {
    const isUsersProfile = currentUserAuth.uid === userInfo.id;

    return (
      <div>
        <div>{userInfo.displayName}</div>
        <div>Handle: @{userInfo.handle} </div>
        {!isUsersProfile ? createFollowLabels() : <></>}
      </div>
    );
  };
  const createFollowLabels = () => {
    if (currentUserInfo) {
      return (
        <div>
          {isFollowedBy ? (
            <div className="profile-followLabel">(follows you)</div>
          ) : (
            <></>
          )}
          {isFollowing ? (
            <button
              onClick={() => {
                unfollowUser(currentUserAuth.uid, userInfo.id);
                setIsFollowing(false);
              }}
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => {
                followUser(currentUserAuth.uid, userInfo.id);
                setIsFollowing(true);
              }}
            >
              Follow
            </button>
          )}
        </div>
      );
    }
    return <></>;
  };

  return (
    <div className="profile-wrapper layout-element">
      <h1>Profile</h1>
      {userInfo ? createHeaderForUser() : ''}
      <h2>Tweets</h2>
      {userInfo ? (
        <TweetFeed
          idsForFeed={[userInfo.id]}
          includeReplies={false}
          currentUserInfo={currentUserInfo}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Profile;

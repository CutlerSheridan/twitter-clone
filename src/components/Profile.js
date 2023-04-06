import './Profile.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import {
  getUserInfo,
  getUserInfoFromHandle,
  followUser,
  unfollowUser,
} from '../FirebaseController';
import { useParams } from 'react-router-dom';
import TweetFeed from './tweets/TweetFeed';

const Profile = () => {
  const currentUserAuth = useContext(UserContext);
  const { userHandle } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [isFollowingCurrentUser, setIsFollowingCurrentUser] = useState(false);
  const [isFollowedByCurrentUser, setIsFollowedByCurrentUser] = useState(false);

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
    const fetchCurrentUserInfo = async () => {
      if (currentUserAuth) {
        const info = await getUserInfo(currentUserAuth.uid);
        setCurrentUserInfo(info);
      }
    };
    fetchCurrentUserInfo();
  }, [currentUserAuth]);
  useEffect(() => {
    if (currentUserInfo && userInfo) {
      setIsFollowingCurrentUser(
        currentUserInfo.following.some((x) => x === userInfo.id)
      );
      setIsFollowedByCurrentUser(
        currentUserInfo.followers.some((x) => x === userInfo.id)
      );
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
          {isFollowedByCurrentUser ? (
            <div className="profile-followLabel">(follows you)</div>
          ) : (
            <></>
          )}
          {isFollowingCurrentUser ? (
            <button
              onClick={() => {
                unfollowUser(currentUserAuth.uid, userInfo.id);
                setIsFollowingCurrentUser(false);
              }}
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => {
                followUser(currentUserAuth.uid, userInfo.id);
                setIsFollowingCurrentUser(true);
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
  const createFeed = () => {
    if (currentUserInfo) {
      return (
        <TweetFeed
          idsForFeed={[userInfo.id]}
          includesReplies={false}
          currentUserInfo={currentUserInfo}
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className="profile-wrapper layout-element">
      <h1>Profile</h1>
      {userInfo ? createHeaderForUser() : ''}
      <h2>Tweets</h2>
      {createFeed()}
    </div>
  );
};

export default Profile;

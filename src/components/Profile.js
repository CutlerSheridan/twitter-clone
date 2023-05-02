import './Profile.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import {
  getUserInfo,
  getUserInfoFromHandle,
  followUser,
  unfollowUser,
  updateUserFields,
  isHandleAvailable,
} from '../FirebaseController';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TweetFeed from './tweets/TweetFeed';
import * as model from '../model';

const Profile = () => {
  const currentUserAuth = useContext(UserContext);
  const { userHandle } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [editingHeader, setEditingHeader] = useState(false);
  const [numOfFollowers, setNumOfFollowers] = useState(0);
  const [selectedFeed, setSelectedFeed] = useState('tweets');
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
    const fetchCurrentUserInfo = async () => {
      if (currentUserAuth) {
        const info = await getUserInfo(currentUserAuth.uid);
        setCurrentUserInfo(info);
      } else {
        setCurrentUserInfo(model.GuestUser());
      }
    };
    fetchCurrentUserInfo();
    fetchUserInfo();
    setSelectedFeed('tweets');
    setIsFollowedByCurrentUser(false);
    setIsFollowingCurrentUser(false);
    setEditingHeader(false);
  }, [userHandle, currentUserAuth]);
  useEffect(() => {
    if (currentUserInfo && userInfo) {
      setIsFollowingCurrentUser(
        currentUserInfo.following.some((x) => x === userInfo.id)
      );
      setIsFollowedByCurrentUser(
        currentUserInfo.followers.some((x) => x === userInfo.id)
      );
      setNumOfFollowers(userInfo.followers.length);
    }
  }, [currentUserInfo, userInfo]);

  const getJoinDateString = () => {
    if (userInfo) {
      const creationMilliseconds = userInfo.joinDate.seconds * 1000;
      const dateString = new Date(creationMilliseconds).toLocaleDateString(
        undefined,
        { month: 'long', year: 'numeric' }
      );
      return dateString;
    }
  };

  const createHeader = () => {
    const isUsersProfile = currentUserAuth
      ? currentUserAuth.uid === userInfo.id
      : false;
    return (
      <div className="profile-header">
        {!editingHeader ? (
          <div>
            <div className="profile-aviAndEditRow">
              <img
                src={userInfo.avi}
                className="profile-avi"
                referrerPolicy="no-referrer"
              ></img>
              {!isUsersProfile ? (
                createFollowButton()
              ) : (
                <button onClick={() => setEditingHeader(true)}>Edit</button>
              )}
            </div>
            <h1>{userInfo.displayName}</h1>
            <div className="profile-handleRow">
              <div className="profile-handle">@{userInfo.handle}</div>
              {!isUsersProfile ? createFollowLabels() : <></>}
            </div>
            <div className="profile-bio">{userInfo.bio}</div>
            <div className="profile-joinDate">
              <span className="material-symbols-outlined">calendar_month</span>{' '}
              Joined {userInfo ? getJoinDateString() : '...'}
            </div>
          </div>
        ) : (
          <form className="profile-headerForm" onSubmit={handleEditSubmit}>
            <label>
              Name{' '}
              <input
                id="edit-displayName"
                maxLength={20}
                placeholder={userInfo.displayName}
              />
            </label>
            <label>
              Handle{' '}
              <input
                className="profile-editHandle"
                id="edit-handle"
                onChange={(e) => {
                  if (!/^[A-Za-z0-9]{1,17}$/.test(e.target.value)) {
                    const typedValue = [...e.target.value];
                    let newValue = typedValue.reduce((prev, x) => {
                      if (/[A-Za-z0-9]/.test(x)) {
                        prev += x;
                      }
                      return prev;
                    }, '');
                    e.target.value = newValue;
                  }
                }}
                pattern="[A-Za-z0-9]{1,20}"
                maxLength={17}
                placeholder={userInfo.handle}
              />
            </label>
            <div className="profile-handleWarning">This handle is taken</div>
            <label>
              Bio{' '}
              <input
                id="edit-bio"
                max-length={300}
                placeholder={userInfo.bio}
              />
            </label>

            <div className="profile-editFormButtons">
              <button type="submit">Save</button>
              <button onClick={() => setEditingHeader(false)}>Cancel</button>
            </div>
          </form>
        )}
        <div className="profile-followsWrapper">
          {/* -1 to following length to account for following yourself */}
          {/* filter out user's ID from following for state */}
          <div className="profile-followsStat">
            <Link
              to="following"
              state={{
                userIds: userInfo.following
                  .filter((x) => x !== userInfo.id)
                  .reverse(),
                title: 'Following',
              }}
            >
              {userInfo.following.length - 1} <span>Following</span>
            </Link>
          </div>
          <div className="profile-followsStat">
            <Link
              to="followers"
              state={{
                userIds: userInfo.followers.reverse(),
                title: 'Followers',
              }}
            >
              {numOfFollowers} <span>Followers</span>
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    );
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    let updatesObj = {};

    const findNonHandleFields = () => {
      const fieldsObj = {};
      const newName = form.querySelector('#edit-displayName').value;
      if (newName && newName !== currentUserInfo.displayName) {
        fieldsObj.displayName = newName;
      }
      const newBio = form.querySelector('#edit-bio').value;
      if (newBio && newBio !== currentUserInfo.bio) {
        fieldsObj.bio = newBio;
      }
      return fieldsObj;
    };

    const newHandle = form.querySelector('#edit-handle').value.toLowerCase();
    if (newHandle && newHandle !== currentUserInfo.handle) {
      if (await isHandleAvailable(newHandle)) {
        updatesObj.handle = newHandle;
        updatesObj = { ...updatesObj, ...findNonHandleFields() };
        await updateUserFields(currentUserAuth.uid, updatesObj);
        setUserInfo((prev) => {
          return { ...prev, ...updatesObj };
        });
        setCurrentUserInfo((prev) => {
          return { ...prev, ...updatesObj };
        });
        navigate(`/${newHandle}`);
      } else {
        form
          .querySelector('.profile-handleWarning')
          .classList.add('profile-handleWarning-taken');
      }
    } else {
      updatesObj = { ...findNonHandleFields() };
      if (Object.keys(updatesObj).length) {
        await updateUserFields(currentUserAuth.uid, updatesObj);
        setEditingHeader(false);
        setUserInfo((prev) => {
          return { ...prev, ...updatesObj };
        });
        setCurrentUserInfo((prev) => {
          return { ...prev, ...updatesObj };
        });
        navigate(`/${currentUserInfo.handle}`);
      }
    }
  };
  const createFollowLabels = () => {
    if (currentUserInfo) {
      return (
        <div>
          {isFollowedByCurrentUser ? (
            <div className="profile-followLabel">Follows you</div>
          ) : (
            <></>
          )}
        </div>
      );
    }
    return <></>;
  };
  const createFollowButton = () => {
    if (currentUserInfo && currentUserInfo.id !== 'guest') {
      return (
        <div>
          {isFollowingCurrentUser ? (
            <button
              onClick={() => {
                unfollowUser(currentUserAuth.uid, userInfo.id);
                setIsFollowingCurrentUser(false);
                setNumOfFollowers((prev) => --prev);
              }}
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => {
                followUser(currentUserAuth.uid, userInfo.id);
                setIsFollowingCurrentUser(true);
                setNumOfFollowers((prev) => ++prev);
              }}
            >
              Follow
            </button>
          )}
        </div>
      );
    }
  };
  const createFeed = () => {
    if (currentUserInfo && userInfo) {
      switch (selectedFeed) {
        case 'tweets':
          return (
            <TweetFeed
              idsForFeed={[userInfo.id]}
              includeReplies={false}
              currentUserInfo={currentUserInfo}
              needsBottomBorder={true}
              needsCredit={true}
            />
          );
        case 'replies':
          return (
            <TweetFeed
              idsForFeed={[userInfo.id]}
              includeReplies={true}
              currentUserInfo={currentUserInfo}
              needsBottomBorder={true}
              needsCredit={true}
            />
          );
        case 'likes':
          return (
            <TweetFeed
              likes={userInfo.likes}
              includeReplies={true}
              currentUserInfo={currentUserInfo}
              needsBottomBorder={true}
              needsCredit={true}
            />
          );
      }
    } else {
      return <></>;
    }
  };
  const getFeedSelectorClasses = (selector) => {
    let className = 'profile-feedSelector';
    if (selector === selectedFeed) {
      className += ' profile-feedSelector-active';
    }
    return className;
  };

  return (
    <div className="profile-wrapper layout-element">
      {userInfo ? (
        createHeader()
      ) : (
        <div className="profile-nonexistantUser">This user does not exist.</div>
      )}
      <div className="profile-feedSelectorWrapper">
        <h2
          className={getFeedSelectorClasses('tweets')}
          onClick={() => setSelectedFeed('tweets')}
        >
          Tweets
        </h2>
        <h2
          className={getFeedSelectorClasses('likes')}
          onClick={() => setSelectedFeed('likes')}
        >
          Likes
        </h2>
        <h2
          className={getFeedSelectorClasses('replies')}
          onClick={() => setSelectedFeed('replies')}
        >
          Replies
        </h2>
      </div>
      {createFeed()}
    </div>
  );
};

export default Profile;

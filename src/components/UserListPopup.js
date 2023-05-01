import { Link, useLocation, useNavigate } from 'react-router-dom';
import './UserListPopup.css';
import { getUsersList } from '../FirebaseController';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

const UserListPopup = () => {
  const location = useLocation();
  const { userIds, title } = location.state;
  const currentUserAuth = useContext(UserContext);
  const [userObjs, setUserObjs] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userIds && !userObjs) {
      getUsersList(userIds).then(setUserObjs);
    }
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const createList = () => {
    if (userObjs) {
      if (userObjs.length === 0) {
        return (
          <div className="userList-list">
            <div className="userList-empty">
              This tweet has not yet received any likes.
            </div>
          </div>
        );
      } else if (userObjs.length > 0) {
        return (
          <div className="userList-list">
            {userObjs.map((x) => (
              <Link
                to={`../../${x.handle}`}
                key={`${Math.random()}${Math.random()}`}
              >
                <div className="userList-userCard">
                  <img
                    className="userList-avi"
                    src={x.avi}
                    referrerPolicy="no-referrer"
                  ></img>
                  <div className="userList-nameAndHandle">
                    <div className="userList-name">{x.displayName}</div>
                    <div className="userList-handleAndFollowLabel">
                      <div className="userList-handle">@{x.handle}</div>
                      {createFollowsLabel(x)}
                    </div>
                    <div>{x.bio}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );
      }
    } else {
      return (
        <div className="userList-list">
          <div className="userList-loading">Loading...</div>
        </div>
      );
    }
  };
  const createFollowsLabel = (x) => {
    if (
      currentUserAuth &&
      x.following.some((y) => y === currentUserAuth.uid) &&
      x.id !== currentUserAuth.uid
    ) {
      return <div className="userList-followLabel">Follows you</div>;
    }
  };

  return (
    <div className="userList-wrapper">
      <section className="userList-innerContainer">
        <div className="userList-topRow">
          <button onClick={goBack} className="userList-close">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="userList-title">{title}</h2>
        </div>
        {createList()}
        {/* <div className="userList-list">
          {userObjs ? (
            userObjs.map((x) => (
              <Link
                to={`../../${x.handle}`}
                key={`${Math.random()}${Math.random()}`}
              >
                <div className="userList-userCard">
                  <img
                    className="userList-avi"
                    src={x.avi}
                    referrerPolicy="no-referrer"
                  ></img>
                  <div className="userList-nameAndHandle">
                    <div className="userList-name">{x.displayName}</div>
                    <div className="userList-handleAndFollowLabel">
                      <div className="userList-handle">@{x.handle}</div>
                      {createFollowsLabel(x)}
                    </div>
                    <div>{x.bio}</div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="userList-loading">Loading...</div>
          )}
        </div> */}
      </section>
    </div>
  );
};

export default UserListPopup;

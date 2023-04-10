import { Link, useLocation } from 'react-router-dom';
import './UserListPopup.css';
import { getUsersList } from '../FirebaseController';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

const UserListPopup = () => {
  const location = useLocation();
  const { userIds, title } = location.state;
  const currentUserAuth = useContext(UserContext);
  const [userObjs, setUserObjs] = useState([]);

  useEffect(() => {
    if (userIds.length && !userObjs.length) {
      getUsersList(userIds).then(setUserObjs);
    }
  });

  return (
    <div className="userList-wrapper">
      <section className="userList-innerContainer">
        <Link to="..">X</Link>
        <h2 className="userList-title">{title}</h2>
        <div className="userList-list">
          {userObjs.length ? (
            userObjs.map((x) => (
              <div
                className="userList-userCard"
                key={`${Math.random()}${Math.random()}`}
              >
                <img className="userList-avi" src={x.avi}></img>
                <div className="userList-nameAndHandle">
                  <div>{x.displayName}</div>
                  <div className="userList-handleAndFollowLabel">
                    <div>@{x.handle}</div>
                    {x.following.some((y) => y === currentUserAuth.uid) &&
                    x.id !== currentUserAuth.uid ? (
                      <div className="userList-followLabel">(follows you)</div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Loading</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserListPopup;

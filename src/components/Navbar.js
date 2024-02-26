import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { getUserInfo } from '../FirebaseController';

const Navbar = () => {
  const userAuth = useContext(UserContext);
  const [currentUserHandle, setCurrentUserHandle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuth) {
      getUserInfo(userAuth.uid).then((result) => {
        setCurrentUserHandle(result.handle);
      });
    }
  }, [userAuth]);

  const handleFindUser = (e) => {
    e.preventDefault();
    let userHandle = e.target[0].value.toLowerCase();
    if (userHandle.charAt(0) === '@') {
      userHandle = userHandle.slice(1);
    }
    const formElement = document.querySelector('.navbar-findUserForm');
    formElement.reset();
    navigate(`/${userHandle}`);
  };
  const optionsForUser = () => {
    return (
      <nav>
        <div className="navbar-button">
          <Link to="/">
            <span className="material-symbols-outlined">home</span>
            <div className="navbar-button-text">Home</div>
          </Link>
        </div>
        <div
          className={`navbar-button ${
            userAuth ? '' : 'navbar-button-disabled'
          }`}
        >
          <Link to={`${currentUserHandle}`}>
            <span className="material-symbols-outlined">account_circle</span>{' '}
            <div className="navbar-button-text">Profile</div>
          </Link>
        </div>
        <form className="navbar-findUserForm" onSubmit={handleFindUser}>
          <label className="navbar-searchLabel" htmlFor="userSearchField">
            Find user:
          </label>
          <div className="navbar-searchFieldAndButton">
            <input type="text" id="userSearchField"></input>
            <button type="submit">Go</button>
          </div>
        </form>
        <div className="credit navbar-credit">
          <p>Made by Cutler Sheridan.</p>
          <p>
            See more{' '}
            <a href="https://cutlersheridan.github.io/portfolio">here</a>.
          </p>
        </div>
      </nav>
    );
  };
  return (
    <div className="navbar-wrapper layout-element">{optionsForUser()}</div>
  );
};

export default Navbar;

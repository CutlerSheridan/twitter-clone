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
        <Link to="/">Home</Link>
        <Link to={`${currentUserHandle}`}>Profile</Link>
        <form className="navbar-findUserForm" onSubmit={handleFindUser}>
          <label>
            Find user:
            <input></input>
            <button type="submit">Go</button>
          </label>
        </form>
      </nav>
    );
  };
  return (
    <div className="navbar-wrapper layout-element">
      <h2>Navigation elements</h2>
      {currentUserHandle ? optionsForUser() : ''}
    </div>
  );
};

export default Navbar;

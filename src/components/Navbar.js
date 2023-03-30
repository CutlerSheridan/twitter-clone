import './Navbar.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';

const Navbar = () => {
  const user = useContext(UserContext);
  const optionsForUser = () => {
    return <Link to={`profile/${user.uid}`}>Profile</Link>;
  };
  return (
    <div className="navbar-wrapper layout-element">
      <h2>Navigation elements</h2>
      {user ? optionsForUser() : ''}
    </div>
  );
};

export default Navbar;

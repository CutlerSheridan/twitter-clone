import { Link, useLocation } from 'react-router-dom';
import './UserListPopup.css';

const UserListPopup = () => {
  const location = useLocation();
  const { userIds } = location.state;

  return (
    <div className="userList-wrapper">
      <section className="userList-innerContainer">
        <Link to="..">X</Link>
        {userIds.map((id) => (
          <div key={`${Math.random()}${Math.random()}`}>{id}</div>
        ))}
      </section>
    </div>
  );
};

export default UserListPopup;

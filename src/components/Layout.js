import Navbar from './Navbar';
import SignIn from './SignIn';
import { UserContext } from '../UserContext';
import { Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, checkIfUserIsNew } from '../FirebaseController';
import { useState, useEffect } from 'react';
import './Layout.css';

const Layout = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (x) => {
      setUser(x);
      checkIfUserIsNew(x);
    });
  }, []);

  return (
    <div className="layout-wrapper">
      <UserContext.Provider value={user}>
        <Navbar />
        <Outlet />
        <SignIn />
      </UserContext.Provider>
    </div>
  );
};

export default Layout;

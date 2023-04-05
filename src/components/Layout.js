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
    <UserContext.Provider value={user}>
      <div className="layout-wrapper">
        <Navbar />
        <Outlet />
        <SignIn />
      </div>
    </UserContext.Provider>
  );
};

export default Layout;

import Navbar from './Navbar';
import SignIn from './SignIn';
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
      console.log(x);
      checkIfUserIsNew(x);
    });
  }, []);

  return (
    <div className="layout-wrapper">
      <Navbar />
      <Outlet />
      <SignIn user={user} />
    </div>
  );
};

export default Layout;

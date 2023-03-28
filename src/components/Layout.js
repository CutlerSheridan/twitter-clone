import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;

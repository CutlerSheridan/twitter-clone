import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import Home from './components/Home.js';
import Profile from './components/Profile';
import UserListPopup from './components/UserListPopup';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":userHandle" element={<Profile />}>
          <Route path="following" element={<UserListPopup />} />
          <Route path="followers" element={<UserListPopup />} />
        </Route>
        <Route path=":tweetId/likes" element={<UserListPopup />} />
      </Route>
    </Routes>
  );
};

export default App;

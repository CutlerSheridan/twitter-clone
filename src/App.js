import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import Home from './components/Home.js';
import Profile from './components/Profile';
import UserListPopup from './components/UserListPopup';
import BigTweet from './components/tweets/BigTweet';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":userHandle" element={<Profile />}>
          <Route path="following" element={<UserListPopup />} />
          <Route path="followers" element={<UserListPopup />} />
        </Route>
        <Route path=":anyPath/tweet/:userIdTweetId" element={<BigTweet />}>
          <Route path="likes" element={<UserListPopup />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

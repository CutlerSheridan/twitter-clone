import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import Home from './components/Home.js';
import Profile from './components/Profile';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":userHandle" element={<Profile />}>
          <Route path="following" />
          <Route path="followers" />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

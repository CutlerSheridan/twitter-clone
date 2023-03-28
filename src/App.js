import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import Home from './components/Home.js';
import Profile from './components/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile:profileid" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;

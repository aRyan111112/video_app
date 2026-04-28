import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadVideo from './pages/UploadVideo';
import WatchVideo from './pages/WatchVideo';
import ChannelProfile from './pages/ChannelProfile';
import History from './pages/History';
import LikedVideos from './pages/LikedVideos';
import Library from './pages/Library';
import Subscriptions from './pages/Subscriptions';
import Dashboard from './pages/Dashboard';
import Playlist from './pages/Playlist';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-container bg-bg-color w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<UploadVideo />} />
            <Route path="/watch/:videoId" element={<WatchVideo />} />
            <Route path="/channel/:username" element={<ChannelProfile />} />
            <Route path="/history" element={<History />} />
            <Route path="/liked" element={<LikedVideos />} />
            <Route path="/library" element={<Library />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/playlist/:playlistId" element={<Playlist />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

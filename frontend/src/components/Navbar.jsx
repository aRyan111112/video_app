import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-left">
        <button className="btn-icon menu-btn">
          {/* We'll import icons from react-icons properly later, for now simulate */}
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>
          </div>
          <span className="logo-text text-gradient">VidStream</span>
        </Link>
      </div>

      <div className="navbar-center hidden sm:flex">
        <form onSubmit={handleSearch} className="search-bar">
          <input 
            type="text" 
            placeholder="Search for amazing content..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>
      </div>

      <div className="navbar-right">
        <div className="user-profile flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/upload" className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors hidden sm:block">
                Dashboard
              </Link>
              <Link to={`/channel/${user.username}`}>
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                alt={user.username} 
                className="w-9 h-9 rounded-full object-cover border border-white/20"
              />
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium rounded-full transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-full transition-colors shadow-lg shadow-accent/20 whitespace-nowrap">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

const Library = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [liked, setLiked] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        const [historyRes, likedRes, playlistsRes] = await Promise.all([
          api.get('/users/watch-history'),
          api.get('/likes/videos'),
          api.get(`/playlist/user/${user._id}`)
        ]);
        setHistory(historyRes.data?.data || []);
        setLiked(likedRes.data?.data || []);
        setPlaylists(playlistsRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load library data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchLibraryData();
    else setLoading(false);
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-70px)] gap-4">
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="4em" width="4em" className="text-gray-600 mb-4" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        <h2 className="text-xl font-semibold text-white">Enjoy your favorite videos</h2>
        <p className="text-gray-400">Sign in to access videos that you've liked or watched</p>
        <Link to="/login" className="mt-4 px-6 py-2 bg-accent text-white font-medium rounded-full hover:bg-accent-hover transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-70px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-12">
      {/* Profile Header section */}
      <div className="flex items-center gap-6 border-b border-white/10 pb-8">
        <img 
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
          alt={user.username} 
          className="w-20 h-20 rounded-full object-cover border-2 border-accent/50"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">{user.fullName || user.username}</h1>
          <p className="text-gray-400">@{user.username}</p>
        </div>
      </div>

      {/* History Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            History
          </h2>
          <Link to="/history" className="text-accent hover:text-white transition-colors text-sm font-medium">View all</Link>
        </div>
        {history.length === 0 ? (
          <p className="text-gray-500">Videos you watch will show up here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.slice(0, 4).map((video, index) => (
              <VideoCard key={`hist-${video._id || index}`} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Liked Videos Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
             Liked Videos
          </h2>
          <Link to="/liked" className="text-accent hover:text-white transition-colors text-sm font-medium">View all</Link>
        </div>
        {liked.length === 0 ? (
          <p className="text-gray-500">Videos you like will show up here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {liked.slice(0, 4).map((video, index) => (
              <VideoCard key={`liked-${video._id || index}`} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Playlists Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            Playlists
          </h2>
        </div>
        {playlists.length === 0 ? (
          <p className="text-gray-500">You haven't created any playlists yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <Link key={playlist._id} to={`/playlist/${playlist._id}`} className="bg-bg-secondary p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="aspect-video bg-black rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                   <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-600" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                </div>
                <h3 className="font-bold text-white group-hover:text-accent transition-colors truncate">{playlist.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{playlist.videos?.length || 0} videos</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Library;

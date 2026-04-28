import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const PlaylistsTab = ({ channelId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await api.get(`/playlist/user/${channelId}`);
        setPlaylists(response.data?.data || []);
      } catch (err) {
        console.error('Failed to load playlists', err);
      } finally {
        setLoading(false);
      }
    };

    if (channelId) fetchPlaylists();
  }, [channelId]);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading playlists...</div>;

  return (
    <div className="p-4 lg:p-8 w-full">
      {playlists.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          This channel hasn't created any playlists yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map(playlist => (
            <Link to={`/playlist/${playlist._id}`} key={playlist._id} className="bg-bg-secondary rounded-2xl overflow-hidden hover:bg-white/5 transition-colors cursor-pointer group block">
              <div className="aspect-video bg-black relative flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span className="mt-2 font-medium">View Playlist</span>
                </div>
                {/* Fallback playlist icon */}
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500" height="3em" width="3em" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white line-clamp-1">{playlist.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{playlist.description}</p>
                <div className="mt-3 text-xs text-gray-500 font-medium">
                  Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistsTab;

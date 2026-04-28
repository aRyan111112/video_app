import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SaveToPlaylistModal = ({ isOpen, onClose, videoId }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchPlaylists();
    }
  }, [isOpen, user]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/playlist/user/${user._id}`);
      setPlaylists(response.data?.data || []);
    } catch (err) {
      console.error('Failed to load playlists', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoInPlaylist = async (playlist) => {
    const isVideoInPlaylist = playlist.videos.includes(videoId);
    try {
      if (isVideoInPlaylist) {
        await api.patch(`/playlist/remove/${videoId}/${playlist._id}`);
        setPlaylists(playlists.map(p => 
          p._id === playlist._id ? { ...p, videos: p.videos.filter(id => id !== videoId) } : p
        ));
      } else {
        await api.patch(`/playlist/add/${videoId}/${playlist._id}`);
        setPlaylists(playlists.map(p => 
          p._id === playlist._id ? { ...p, videos: [...p.videos, videoId] } : p
        ));
      }
    } catch (err) {
      console.error('Failed to toggle playlist video', err);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      setCreating(true);
      const res = await api.post('/playlist', { name: newPlaylistName, description: newPlaylistDesc || ' ' });
      const newPlaylist = res.data?.data;
      if (newPlaylist) {
        // Automatically add the current video to the new playlist
        await api.patch(`/playlist/add/${videoId}/${newPlaylist._id}`);
        newPlaylist.videos = [videoId];
        setPlaylists([...playlists, newPlaylist]);
        setNewPlaylistName('');
        setNewPlaylistDesc('');
        setShowCreate(false);
      }
    } catch (err) {
      console.error('Failed to create playlist', err);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Save to playlist</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {playlists.map(playlist => {
                const isSaved = playlist.videos.includes(videoId);
                return (
                  <label key={playlist._id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isSaved}
                      onChange={() => toggleVideoInPlaylist(playlist)}
                      className="w-4 h-4 rounded border-gray-500 text-accent focus:ring-accent bg-transparent"
                    />
                    <span className="text-white select-none truncate flex-1">{playlist.name}</span>
                    {isSaved && <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-accent" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </label>
                );
              })}
              {playlists.length === 0 && !showCreate && (
                <p className="text-sm text-gray-400 text-center py-4">You don't have any playlists.</p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          {!showCreate ? (
            <button 
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-accent transition-colors"
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create new playlist
            </button>
          ) : (
            <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Name" 
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none py-1 text-sm text-white placeholder:text-gray-500"
              />
              <input 
                type="text" 
                placeholder="Description (optional)" 
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none py-1 text-sm text-white placeholder:text-gray-500"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-xs font-semibold hover:bg-white/10 rounded-full text-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={!newPlaylistName.trim() || creating} className="px-3 py-1.5 text-xs font-semibold bg-white text-black hover:bg-gray-200 rounded-full disabled:opacity-50">
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveToPlaylistModal;

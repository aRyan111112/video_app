import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/playlist/${playlistId}`);
        setPlaylist(response.data?.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) fetchPlaylist();
  }, [playlistId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-70px)] bg-bg-color">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-70px)] bg-bg-color">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error || 'Playlist not found'}
        </div>
      </div>
    );
  }

  const videos = playlist.videos || [];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Info */}
      <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 flex flex-col gap-4">
        <div className="w-full aspect-video md:aspect-square bg-bg-secondary rounded-2xl overflow-hidden relative group">
          {videos.length > 0 ? (
            <img 
              src={videos[0].thumbnail} 
              alt={playlist.name} 
              className="w-full h-full object-cover blur-sm group-hover:blur-none transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center bg-bg-tertiary">
               <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500" height="4em" width="4em" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end">
            <h1 className="text-3xl font-bold text-white mb-2">{playlist.name}</h1>
            <p className="text-gray-300 font-medium mb-4">{videos.length} videos</p>
            {videos.length > 0 && (
              <Link to={`/watch/${videos[0]._id}`} className="w-full py-3 bg-white text-black font-bold rounded-full text-center hover:bg-gray-200 transition-colors flex justify-center items-center gap-2">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
                Play all
              </Link>
            )}
          </div>
        </div>

        <div className="bg-bg-secondary p-6 rounded-2xl">
          <Link to={`/channel/${playlist.owner?.username}`} className="flex items-center gap-3 mb-4 group">
            <img 
              src={playlist.owner?.avatar || `https://ui-avatars.com/api/?name=${playlist.owner?.username}&background=random`} 
              alt={playlist.owner?.username} 
              className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-accent transition-all"
            />
            <div>
              <p className="font-bold text-white group-hover:text-accent transition-colors">{playlist.owner?.fullName || playlist.owner?.username}</p>
              <p className="text-xs text-gray-400">Creator</p>
            </div>
          </Link>
          <div className="text-sm text-gray-300 whitespace-pre-wrap">
            {playlist.description || 'No description provided.'}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Updated on {new Date(playlist.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Videos List */}
      <div className="flex-1 bg-bg-secondary p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          Videos
        </h2>
        {videos.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No videos in this playlist yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {videos.map((video, index) => (
              <div key={video._id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="w-8 flex items-center justify-center font-medium text-gray-500 group-hover:text-white">
                  {index + 1}
                </div>
                <Link to={`/watch/${video._id}`} className="shrink-0 relative">
                  <img src={video.thumbnail} alt={video.title} className="w-40 aspect-video object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="text-white" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
                  </div>
                </Link>
                <div className="flex-1 flex flex-col justify-center">
                  <Link to={`/watch/${video._id}`} className="font-semibold text-lg text-white hover:text-accent line-clamp-2">
                    {video.title}
                  </Link>
                  <Link to={`/channel/${video.owner?.username}`} className="text-sm text-gray-400 hover:text-white mt-1">
                    {video.owner?.username}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;

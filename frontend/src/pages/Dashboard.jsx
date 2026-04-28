import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, videosRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/videos')
        ]);
        
        // stats returns array because it uses aggregate, we grab the first element
        setStats(statsRes.data?.data?.[0] || {
            subscribers: 0,
            views: 0,
            videos: 0,
            videoLikes: 0
        });
        setVideos(videosRes.data?.data || []);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const togglePublish = async (videoId) => {
    try {
      await api.patch(`/video/toggle/publish/${videoId}`);
      setVideos(videos.map(v => 
        v._id === videoId ? { ...v, isPublished: !v.isPublished } : v
      ));
    } catch (err) {
      console.error('Failed to toggle publish status', err);
    }
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/video/delete/${videoId}`);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (err) {
      console.error('Failed to delete video', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-70px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Channel Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.fullName}</p>
        </div>
        <Link to="/upload" className="px-6 py-2.5 bg-accent text-white font-semibold rounded-full hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-lg shadow-accent/20">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Upload Video
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-secondary p-6 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="text-blue-400 text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">Total Views</p>
          <h3 className="text-3xl font-bold text-white mt-1">{stats?.views || 0}</h3>
        </div>
        <div className="bg-bg-secondary p-6 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="text-accent text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h66c6.2-47.4 34.8-87.3 75.1-109.4z"></path></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">Subscribers</p>
          <h3 className="text-3xl font-bold text-white mt-1">{stats?.subscribers || 0}</h3>
        </div>
        <div className="bg-bg-secondary p-6 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-red-400 text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">Total Likes</p>
          <h3 className="text-3xl font-bold text-white mt-1">{stats?.videoLikes || 0}</h3>
        </div>
        <div className="bg-bg-secondary p-6 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-green-400 text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">Total Videos</p>
          <h3 className="text-3xl font-bold text-white mt-1">{stats?.videos || 0}</h3>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-bg-secondary rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Your Videos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="py-4 px-6 font-semibold text-gray-400">Video</th>
                <th className="py-4 px-6 font-semibold text-gray-400">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-400">Date Uploaded</th>
                <th className="py-4 px-6 font-semibold text-gray-400">Views</th>
                <th className="py-4 px-6 font-semibold text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    No videos uploaded yet.
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img src={video.thumbnail} alt="thumbnail" className="w-24 aspect-video object-cover rounded-md bg-black" />
                        <span className="font-medium text-white max-w-xs truncate">{video.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => togglePublish(video._id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${video.isPublished ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}
                      >
                        {video.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {video.views || 0}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <Link to={`/watch/${video._id}`} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </Link>
                        <button onClick={() => deleteVideo(video._id)} className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-full transition-colors">
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import api from '../api/axios';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Backend returns: res.data.data.docs for paginated aggregate
        // Or sometimes just res.data.data depending on pagination structure
        const response = await api.get('/video/get-all-video?page=1&limit=20');
        const videoData = response.data?.data?.docs || response.data?.data || [];
        setVideos(videoData);
      } catch (err) {
        // If 401 Unauthorized, maybe it's because they aren't logged in
        if (err.response?.status === 401) {
          setError('Please sign in to view videos.');
        } else {
          setError('Failed to fetch videos. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-8 w-full min-h-[calc(100vh-70px)] bg-bg-color text-white">
      
      <h2 className="text-2xl font-bold mb-6">Recommended</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center">
          {error}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No videos found. Be the first to upload one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

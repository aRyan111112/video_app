import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoComments from '../components/VideoComments';
import SaveToPlaylistModal from '../components/SaveToPlaylistModal';

const WatchVideo = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideoAndRecordHistory = async () => {
      try {
        setLoading(true);
        // Fetch video details
        const response = await api.get(`/video/get-video-by-id/${videoId}`);
        const fetchedVideo = response.data?.data;
        setVideo(fetchedVideo);

        // Record to watch history silently
        await api.post(`/video/watch-history/${videoId}`).catch(e => console.log('History record failed:', e));

        // If user is logged in, fetch like status and subscription status
        if (user && fetchedVideo) {
          // Check if liked
          api.get('/likes/videos').then(res => {
            const likedVideos = res.data?.data || [];
            if (likedVideos.some(v => v._id === videoId)) {
              setIsLiked(true);
            }
          }).catch(() => {});

          // Check if subscribed and get sub count
          const channelUsername = fetchedVideo.owner?.username;
          if (channelUsername) {
            api.get(`/users/channel/${channelUsername}`).then(res => {
              setIsSubscribed(!!res.data?.data?.isSubscribed);
              setSubscribersCount(res.data?.data?.subscribersCount || 0);
            }).catch(() => {});
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoAndRecordHistory();
  }, [videoId, user]);

  const handleLike = async () => {
    if (!user) return alert('Please sign in to like this video');
    try {
      await api.post(`/likes/toggle/v/${videoId}`);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return alert('Please sign in to subscribe');
    if (!video?.owner?._id) return;
    try {
      await api.post(`/subscriptions/c/${video.owner._id}`);
      setSubscribersCount(prev => isSubscribed ? prev - 1 : prev + 1);
      setIsSubscribed(!isSubscribed);
    } catch (err) {
      console.error('Failed to toggle subscription', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-70px)] bg-bg-color">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-70px)] bg-bg-color">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error || 'Video not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-70px)] bg-bg-color text-white p-4 lg:p-8 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <video
            src={video.videoFile}
            poster={video.thumbnail}
            controls
            autoPlay
            className="w-full h-full object-contain"
          ></video>
        </div>

        {/* Video Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <Link to={`/channel/${video.owner?.username || 'unknown'}`} className="shrink-0 cursor-pointer">
                <img 
                  src={video.owner?.avatar || `https://ui-avatars.com/api/?name=User&background=random`} 
                  alt="Channel" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-transparent hover:border-accent transition-colors" 
                />
              </Link>
              <div>
                <Link to={`/channel/${video.owner?.username || 'unknown'}`} className="font-semibold text-lg hover:text-accent transition-colors">
                  {video.owner?.username || 'Unknown Channel'}
                </Link>
                <p className="text-sm text-gray-400">{subscribersCount} subscribers</p>
              </div>
              
              {isSubscribed ? (
                <button onClick={handleSubscribe} className="ml-4 px-5 py-2 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors flex items-center gap-2">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                  Subscribed
                </button>
              ) : (
                <button onClick={handleSubscribe} className="ml-4 px-5 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                  Subscribe
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-white/10 rounded-full overflow-hidden">
                <button 
                  onClick={handleLike}
                  className={`px-4 py-2 transition-colors flex items-center gap-2 border-r border-white/10 ${isLiked ? 'text-accent hover:bg-white/10' : 'hover:bg-white/20 text-white'}`}
                >
                  <svg stroke="currentColor" fill={isLiked ? "currentColor" : "none"} strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  Like
                </button>
                <button className="px-4 py-2 hover:bg-white/20 transition-colors flex items-center justify-center">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </button>
              </div>

              <button 
                onClick={() => setIsSaveModalOpen(true)}
                className="px-5 py-2 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Save
              </button>
            </div>
          </div>

          <div className="bg-bg-secondary p-4 rounded-xl mt-2 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex gap-4 text-sm font-semibold mb-2">
              <span>{video.views || 0} views</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>

        {/* Comments Section */}
        <VideoComments videoId={videoId} />

        <SaveToPlaylistModal 
          isOpen={isSaveModalOpen} 
          onClose={() => setIsSaveModalOpen(false)} 
          videoId={videoId} 
        />

      </div>
    </div>
  );
};

export default WatchVideo;

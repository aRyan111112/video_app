import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';
import CommunityTab from '../components/CommunityTab';
import PlaylistsTab from '../components/PlaylistsTab';

const ChannelProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('Videos');
  const [channelVideos, setChannelVideos] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/channel/${username}`);
        setProfile(response.data?.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load channel profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  useEffect(() => {
    // Only fetch videos if active tab is Videos
    if (activeTab === 'Videos' && profile?._id) {
      api.get(`/video/get-all-video?userId=${profile._id}`)
         .then(res => setChannelVideos(res.data?.data?.docs || []))
         .catch(err => console.log('Failed to fetch videos', err));
    }
  }, [activeTab, profile]);

  const handleSubscribe = async () => {
    if (!profile) return;
    try {
      await api.post(`/subscriptions/c/${profile._id}`);
      setProfile(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
      }));
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

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-70px)] bg-bg-color">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error || 'Channel not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-70px)] bg-bg-color text-white flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Cover Image */}
        <div className="w-full h-48 md:h-64 lg:h-80 bg-bg-tertiary rounded-b-3xl overflow-hidden relative">
          {profile.coverImage ? (
            <img 
              src={profile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-accent to-purple-600"></div>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative z-10 px-4 lg:px-12 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end -mt-12 md:-mt-16 mb-8">
          <img 
            src={profile.avatar} 
            alt={profile.username} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-bg-color object-cover bg-bg-secondary"
          />
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold">{profile.fullName || profile.username}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-gray-400 text-sm">
              <span>@{profile.username}</span>
              <span>•</span>
              <span>{profile.subscribersCount} subscribers</span>
              <span>•</span>
              <span>{profile.channelIsSubscribedToCount} subscribed</span>
            </div>
            {profile.email && <p className="text-sm mt-2 text-gray-300">{profile.email}</p>}
          </div>
          
          <div className="pb-4 shrink-0">
            {profile.isSubscribed ? (
              <button onClick={handleSubscribe} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors flex items-center gap-2 shadow-lg">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                Subscribed
              </button>
            ) : (
              <button onClick={handleSubscribe} className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 font-semibold rounded-full transition-colors shadow-lg">
                Subscribe
              </button>
            )}
          </div>
        </div>

        {/* Tabs / Content Area */}
        <div className="px-4 lg:px-12 w-full border-b border-white/10">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {['Home', 'Videos', 'Playlists', 'Community'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-medium transition-colors ${activeTab === tab ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'Videos' && (
             <div className="p-4 lg:px-12">
               {channelVideos.length === 0 ? (
                 <div className="text-center text-gray-500 py-12">No videos found.</div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   {channelVideos.map(video => (
                     <VideoCard key={video._id} video={video} />
                   ))}
                 </div>
               )}
             </div>
          )}
          
          {activeTab === 'Playlists' && <PlaylistsTab channelId={profile._id} />}
          
          {activeTab === 'Community' && <CommunityTab channelId={profile._id} />}
          
          {activeTab === 'Home' && (
            <div className="p-4 lg:p-12 text-center text-gray-400">
              Welcome to the channel of @{profile.username}!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;

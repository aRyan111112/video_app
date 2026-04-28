import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Subscriptions = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        // getSubscribedChannels endpoint requires subscriberId
        const response = await api.get(`/subscriptions/u/${user._id}`);
        const subscriptionDocs = response.data?.data || [];
        // Each doc has a ChannelsSubscribed array with one user object
        const extractedChannels = subscriptionDocs.map(doc => doc.ChannelsSubscribed?.[0]).filter(Boolean);
        setChannels(extractedChannels);
      } catch (err) {
        console.error('Failed to load subscriptions', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchSubscriptions();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-70px)] gap-4">
        <h2 className="text-xl font-semibold text-white">Don't miss new videos</h2>
        <p className="text-gray-400">Sign in to see updates from your favorite channels</p>
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Subscriptions
      </h1>

      {channels.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          You haven't subscribed to any channels yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {channels.map((c, idx) => (
            <div key={c._id || idx} className="bg-bg-secondary rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
              <Link to={`/channel/${c.username}`}>
                <img 
                  src={c.avatar || `https://ui-avatars.com/api/?name=${c.username}&background=random`} 
                  alt={c.username} 
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-transparent hover:border-accent transition-colors"
                />
              </Link>
              <Link to={`/channel/${c.username}`} className="text-lg font-bold text-white hover:text-accent transition-colors line-clamp-1">
                {c.fullName || c.username}
              </Link>
              <p className="text-sm text-gray-400 mt-1 mb-4">@{c.username}</p>
                <Link to={`/channel/${c.username}`} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-colors">
                  View Channel
                </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;

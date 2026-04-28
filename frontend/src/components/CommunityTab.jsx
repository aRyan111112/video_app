import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CommunityTab = ({ channelId }) => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTweet, setNewTweet] = useState('');
  
  const isOwner = user && channelId && user._id === channelId;

  const fetchTweets = async () => {
    try {
      const response = await api.get(`/tweets/user/${channelId}`);
      setTweets(response.data?.data || []);
    } catch (err) {
      console.error('Failed to load tweets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelId) fetchTweets();
  }, [channelId]);

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;
    try {
      await api.post('/tweets', { content: newTweet });
      setNewTweet('');
      fetchTweets();
    } catch (err) {
      console.error('Failed to post tweet', err);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      await api.delete(`/tweets/${tweetId}`);
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (err) {
      console.error('Failed to delete tweet', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading community posts...</div>;

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto flex flex-col gap-6">
      {isOwner && (
        <form onSubmit={handlePostTweet} className="bg-bg-secondary p-4 rounded-xl flex flex-col gap-3">
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-b border-white/10 outline-none resize-none p-2 placeholder:text-gray-500 text-white min-h-[80px]"
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={!newTweet.trim()}
              className="px-6 py-2 bg-accent text-white font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {tweets.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          This channel hasn't posted anything yet.
        </div>
      ) : (
        tweets.map((tweet) => (
          <div key={tweet._id} className="bg-bg-secondary p-6 rounded-2xl flex flex-col gap-3">
            <p className="text-white whitespace-pre-wrap">{tweet.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-3 mt-1">
              <span>{new Date(tweet.createdAt).toLocaleDateString()} at {new Date(tweet.createdAt).toLocaleTimeString()}</span>
              {isOwner && (
                <button 
                  onClick={() => handleDeleteTweet(tweet._id)}
                  className="text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommunityTab;

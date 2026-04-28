import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const VideoComments = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${videoId}`);
      setComments(response.data?.data?.docs || []);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      await api.post(`/comments/${videoId}`, { content: newComment });
      setNewComment('');
      fetchComments(); // Refresh comments to get populated owner
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/c/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  if (loading) return <div className="text-gray-400 py-4">Loading comments...</div>;

  return (
    <div className="mt-8 bg-bg-secondary p-4 lg:p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-6">{comments.length} Comments</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
          <img src={user.avatar} alt="You" className="w-10 h-10 rounded-full object-cover shrink-0" />
          <div className="flex-1 flex flex-col items-end gap-2">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..." 
              className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none py-1 transition-colors placeholder:text-gray-500"
            />
            {newComment.trim() && (
              <button type="submit" className="px-4 py-1.5 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent-hover transition-colors">
                Comment
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-white/5 rounded-xl flex items-center justify-between">
          <span className="text-gray-300">Sign in to add a comment</span>
          <Link to="/login" className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-semibold">Sign In</Link>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {comments.map((comment) => {
          const owner = Array.isArray(comment.owner) ? comment.owner[0] : comment.owner;
          const isMyComment = user && owner && owner._id === user._id;

          return (
            <div key={comment._id} className="flex gap-4">
              <Link to={`/channel/${owner?.username}`} className="shrink-0">
                <img 
                  src={owner?.avatar || `https://ui-avatars.com/api/?name=${owner?.username}&background=random`} 
                  alt={owner?.username} 
                  className="w-10 h-10 rounded-full object-cover" 
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link to={`/channel/${owner?.username}`} className="font-semibold text-sm hover:text-white transition-colors text-gray-200">
                    @{owner?.username || 'user'}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-100 whitespace-pre-wrap">{comment.content}</p>
                
                {isMyComment && (
                  <button 
                    onClick={() => handleDelete(comment._id)} 
                    className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoComments;

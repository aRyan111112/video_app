import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  // Gracefully handle missing populated fields from backend
  const owner = Array.isArray(video.owner) ? video.owner[0] : video.owner;
  const channelName = owner?.username || 'Unknown Channel';
  const channelAvatar = owner?.avatar || `https://ui-avatars.com/api/?name=${channelName}&background=random`;
  
  // Format duration (e.g. 145 seconds -> 2:25)
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Format date relative to now
  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  return (
    <div className="flex flex-col gap-3 group transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/watch/${video._id}`} className="relative w-full aspect-video rounded-xl overflow-hidden bg-bg-secondary block">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
          {formatDuration(video.duration)}
        </span>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-accent/50">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-5 h-5 ml-1" xmlns="http://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
          </button>
        </div>
      </Link>
      
      <div className="flex gap-3 pr-4">
        <Link to={`/channel/${channelName}`} className="shrink-0">
          <img src={channelAvatar} alt={channelName} className="w-10 h-10 rounded-full object-cover" />
        </Link>
        <div className="flex flex-col">
          <Link to={`/watch/${video._id}`} className="text-white font-semibold text-sm line-clamp-2 leading-snug group-hover:text-accent transition-colors">
            {video.title}
          </Link>
          <Link to={`/channel/${channelName}`} className="text-gray-400 text-sm mt-1 hover:text-white transition-colors">
            {channelName}
          </Link>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <span>{video.views || 0} views</span>
            <span className="text-[10px]">•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

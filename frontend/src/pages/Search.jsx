import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/video/get-all-video?query=${encodeURIComponent(query)}`);
        setVideos(response.data?.data?.docs || []);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-70px)] bg-bg-color">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 w-full min-h-[calc(100vh-70px)] bg-bg-color">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl text-gray-400 mb-6 italic">
          Search results for "<span className="text-white not-italic font-bold">{query}</span>"
        </h1>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
             <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="4em" width="4em" className="mb-4 opacity-20" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             <p className="text-lg">No videos found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

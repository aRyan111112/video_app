import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!thumbnail || !videoFile) {
      setError('Please provide both a thumbnail and a video file.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('thumbnail', thumbnail);
      data.append('videoFile', videoFile);

      const response = await api.post('/video/publish-video', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // Video uploads might take a while
      });

      setSuccess('Video uploaded successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-8 bg-bg-color text-white w-full">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-bg-secondary rounded-2xl shadow-xl border border-white/10 glass">
        <h2 className="text-2xl font-bold">Upload Video</h2>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 bg-bg-tertiary border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-white"
              placeholder="Catchy video title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 mt-1 bg-bg-tertiary border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-white resize-none"
              placeholder="Tell viewers about your video..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="w-full px-2 py-2 mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Video File</label>
              <input
                type="file"
                accept="video/*"
                required
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-full px-2 py-2 mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-accent to-purple-500 hover:from-accent-hover hover:to-purple-600 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Uploading...' : 'Publish Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!avatar) {
      setError('Avatar is required');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('fullName', formData.fullName);
      data.append('password', formData.password);
      data.append('avatar', avatar);
      if (coverImage) {
        data.append('coverImage', coverImage);
      }

      const response = await api.post('/users/register', data);
      
      console.log('Registration successful:', response.data);
      
      // Auto-login after registration
      try {
        const loginResponse = await api.post('/users/login', {
          email: formData.email,
          password: formData.password
        });
        login(loginResponse.data?.data?.user);
        navigate('/');
      } catch (loginErr) {
        console.error('Auto-login failed after registration', loginErr);
        navigate('/login'); // Fallback to login page if auto-login fails
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px)] py-12 bg-bg-color text-white w-full">
      <div className="w-full max-w-xl p-8 space-y-8 bg-bg-secondary rounded-2xl shadow-2xl border border-white/10 glass">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Create an account</h2>
          <p className="mt-2 text-sm text-gray-400">Join VidStream today</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Username *</label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-4 py-2 mt-1 bg-bg-tertiary border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-white placeholder-gray-500"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                className="w-full px-4 py-2 mt-1 bg-bg-tertiary border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-white placeholder-gray-500"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email address *</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 mt-1 bg-bg-tertiary border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-white placeholder-gray-500"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password *</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 mt-1 bg-bg-tertiary border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-white placeholder-gray-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Avatar Image *</label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                required
                onChange={(e) => {
                  console.log("Avatar selected:", e.target.files[0]);
                  setAvatar(e.target.files[0]);
                }}
                className="w-full px-2 py-2 mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Cover Image</label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full px-2 py-2 mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 flex justify-center text-sm font-medium rounded-lg text-white bg-gradient-to-r from-accent to-purple-500 hover:from-accent-hover hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-accent/25"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:text-accent-hover transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

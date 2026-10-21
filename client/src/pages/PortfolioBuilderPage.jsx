import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { portfolioService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { toast } from 'react-hot-toast';
import { Save, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioBuilderPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  
  const [portfolioData, setPortfolioData] = useState({
    headline: '',
    bio: '',
    profileImage: '',
    skills: [],
    projects: [],
    isPublic: true,
    contact: {
      email: '',
      linkedin: '',
      github: '',
      website: ''
    }
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await portfolioService.getPortfolio();
      if (res.success && res.data) {
        setPortfolioData(prev => ({ ...prev, ...res.data }));
        if (res.data.username) {
          setUsername(res.data.username);
          setIsUsernameAvailable(true);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const checkUsername = async (val) => {
    if (!val) {
      setIsUsernameAvailable(null);
      return;
    }
    // Mock check
    setTimeout(() => {
      setIsUsernameAvailable(val.length > 3);
    }, 500);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!username || !isUsernameAvailable) {
        toast.error('Please choose a valid username');
        return;
      }
      await portfolioService.updatePortfolio({ ...portfolioData, username });
      toast.success('Portfolio saved successfully');
    } catch (err) {
      toast.error('Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setPortfolioData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorState message={error} retry={fetchPortfolio} />;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Builder</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create your public developer portfolio</p>
        </div>
        <div className="flex gap-3">
          {username && isUsernameAvailable && (
            <button 
              onClick={() => navigate(`/portfolio/${username}`)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Eye size={16} /> View Public
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Portfolio'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Username / URL setup */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Portfolio URL</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg border dark:border-gray-700">
              futureforge.app/portfolio/
            </span>
            <div className="relative flex-1 max-w-xs">
              <input 
                type="text" 
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  checkUsername(e.target.value);
                }}
                placeholder="your-username"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {username && (
                <div className="absolute right-3 top-2.5">
                  {isUsernameAvailable ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : (
                    <XCircle size={18} className="text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isPublic"
              checked={portfolioData.isPublic}
              onChange={e => handleChange('isPublic', e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
              Make portfolio visible to the public
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
          <h2 className="text-lg font-semibold">About Me</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input 
              type="text" 
              value={portfolioData.headline}
              onChange={e => handleChange('headline', e.target.value)}
              placeholder="Full Stack Developer specializing in React"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea 
              value={portfolioData.bio}
              onChange={e => handleChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Profile Image URL</label>
            <input 
              type="url" 
              value={portfolioData.profileImage}
              onChange={e => handleChange('profileImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
          <h2 className="text-lg font-semibold">Contact Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                value={portfolioData.contact.email}
                onChange={e => handleContactChange('email', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
              <input 
                type="url" 
                value={portfolioData.contact.linkedin}
                onChange={e => handleContactChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input 
                type="url" 
                value={portfolioData.contact.github}
                onChange={e => handleContactChange('github', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Personal Website</label>
              <input 
                type="url" 
                value={portfolioData.contact.website}
                onChange={e => handleContactChange('website', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Skills & Projects placeholders for brevity */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
           <p className="text-gray-500 text-sm italic">
             Skills, Projects, Education, and Experience sections are automatically synced from your Resume Builder.
           </p>
        </div>

      </div>
    </div>
  );
};

export default PortfolioBuilderPage;

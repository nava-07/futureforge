import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { Save, LogOut, Trash2, Moon, Sun, Bell } from 'lucide-react';
import { profileService } from '../services';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileService.updateProfile(profile);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        toast.success('Password updated successfully');
        setPasswords({ current: '', new: '', confirm: '' });
        setLoading(false);
      }, 1000);
    } catch (err) {
      toast.error('Failed to update password');
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deleted (Mock)');
      logout();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar Nav (mock visual) */}
        <div className="col-span-1 space-y-2">
          <div className="p-3 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg font-medium cursor-pointer">
            Account Profile
          </div>
          <div className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium cursor-pointer">
            Appearance
          </div>
          <div className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium cursor-pointer">
            Notifications
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          
          {/* Profile Section */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Preferences Section */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b dark:border-gray-800">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon size={20} className="text-purple-500" /> : <Sun size={20} className="text-yellow-500" />}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-500">Toggle dark appearance</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-blue-500" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive weekly progress reports</p>
                  </div>
                </div>
                <button className="w-12 h-6 rounded-full relative bg-purple-600">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-7" />
                </button>
              </div>
            </div>
          </section>

          {/* Password Section */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={passwords.new}
                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New</label>
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-red-200 dark:border-red-900/30">
            <h2 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h2>
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">Delete Account</p>
                <p className="text-sm text-red-600/70 dark:text-red-400/70">Permanently delete your account and all data</p>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

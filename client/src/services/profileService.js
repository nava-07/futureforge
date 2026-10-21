import api from './api';

const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  }
};

export default profileService;

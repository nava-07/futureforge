import api from './api';

const skillService = {
  getSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },
  
  addSkills: async (skills) => {
    const response = await api.post('/skills', { skills });
    return response.data;
  },
  
  analyzeSkills: async () => {
    const response = await api.post('/skills/analyze');
    return response.data;
  }
};

export default skillService;

import api from './api';

const projectService = {
  getRecommendedProjects: async () => {
    const response = await api.get('/projects/recommended');
    return response.data;
  },
  
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  }
};

export default projectService;

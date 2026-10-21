import api from './api';

const learningService = {
  getLearningPath: async () => {
    const response = await api.get('/learning-path');
    return response.data;
  },
  
  generateLearningPath: async () => {
    const response = await api.post('/learning-path/generate');
    return response.data;
  },
  
  updateProgress: async (monthIndex, itemIndex, completed) => {
    const response = await api.put('/learning-path/progress', { monthIndex, itemIndex, completed });
    return response.data;
  }
};

export default learningService;

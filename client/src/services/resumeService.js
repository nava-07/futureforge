import api from './api';

const resumeService = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  analyzeResume: async () => {
    const response = await api.post('/resume/analyze');
    return response.data;
  },
  
  getResumeHistory: async () => {
    const response = await api.get('/resume/history');
    return response.data;
  },
  
  getLatestAnalysis: async () => {
    const response = await api.get('/resume/latest-analysis');
    return response.data;
  },

  getResume: async () => {
    const response = await api.get('/resume/builder');
    return response.data;
  },

  updateResume: async (data) => {
    const response = await api.put('/resume/builder', data);
    return response.data;
  }
};

export default resumeService;

import api from './api';

const jobMatchService = {
  analyzeJobMatch: async (resumeId, jobDescription) => {
    const response = await api.post('/job-match/analyze', { resumeId, jobDescription });
    return response.data;
  },
  
  getMatchHistory: async () => {
    const response = await api.get('/job-match/history');
    return response.data;
  }
};

export default jobMatchService;

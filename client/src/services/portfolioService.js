import api from './api';

const portfolioService = {
  createOrUpdatePortfolio: async (data) => {
    const response = await api.post('/portfolio', data);
    return response.data;
  },

  updatePortfolio: async (data) => {
    const response = await api.post('/portfolio', data);
    return response.data;
  },
  
  getMyPortfolio: async () => {
    const response = await api.get('/portfolio/me');
    return response.data;
  },

  getPortfolio: async () => {
    const response = await api.get('/portfolio/me');
    return response.data;
  },
  
  getPortfolioByUsername: async (username) => {
    const response = await api.get(`/portfolio/${username}`);
    return response.data;
  },
  
  deletePortfolio: async () => {
    const response = await api.delete('/portfolio');
    return response.data;
  }
};

export default portfolioService;

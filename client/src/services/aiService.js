import api from './api';

const aiService = {
  chat: async (conversationId, message) => {
    const response = await api.post('/ai/chat', { conversationId, message });
    return response.data;
  },
  
  getConversations: async () => {
    const response = await api.get('/ai/conversations');
    return response.data;
  },
  
  getConversation: async (id) => {
    const response = await api.get(`/ai/conversations/${id}`);
    return response.data;
  },
  
  deleteConversation: async (id) => {
    const response = await api.delete(`/ai/conversations/${id}`);
    return response.data;
  },
  
  getSkillAnalysis: async () => {
    const response = await api.get('/ai/skill-analysis');
    return response.data;
  },
  
  getCareerAnalysis: async () => {
    const response = await api.get('/ai/career-analysis');
    return response.data;
  }
};

export default aiService;

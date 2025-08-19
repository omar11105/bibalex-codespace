import axios from './axios';

export const assessmentApi = {
  getAllAssessments: async () => {
    const response = await axios.get('admin/assessment/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  getAssessmentSessions: async () => {
    const response = await axios.get('admin/assessment/sessions', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  createAssessment: async (assessmentData) => {
    const response = await axios.post('admin/assessment/create', assessmentData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  getAssessmentByAccessCode: async (accessCode) => {
    const response = await axios.get(`admin/assessment/${accessCode}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  deactivateAssessment: async (assessmentId) => {
    const response = await axios.post(`admin/assessment/${assessmentId}/deactivate`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  duplicateAssessment: async (assessmentId) => {
    const response = await axios.post(`admin/assessment/${assessmentId}/duplicate`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  startPractice: async (candidateEmail) => {
    const response = await axios.post('assessment/practice/start', { candidateEmail }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  submitPracticeScore: async (sessionId, score) => {
    const response = await axios.post('assessment/practice/submit', { sessionId, score }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
}; 
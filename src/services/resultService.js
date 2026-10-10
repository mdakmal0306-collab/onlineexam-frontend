import { api } from './api';

export const resultService = {
  async getAllResults() {
    const res = await api.get('/results');
    return res.data;
  },

  async getMyResults() {
    const res = await api.get('/results/me');
    return res.data;
  },

  async getMyHistory() {
    const res = await api.get('/results/me/history');
    return res.data;
  },

  async getStudentResults(studentId) {
    const res = await api.get(`/results/student/${studentId}`);
    return res.data;
  },

  async getExamResults(examId) {
    const res = await api.get(`/results/exam/${examId}`);
    return res.data;
  },

  async getResultById(id) {
    const res = await api.get(`/results/${id}`);
    return res.data;
  }
};

import { api } from './api';

export const examService = {
  async getAllExams() {
    const res = await api.get('/exams');
    return res.data;
  },

  async getAvailableExams() {
    const res = await api.get('/exams/available');
    return res.data;
  },

  async getExamById(id) {
    const res = await api.get(`/exams/${id}`);
    return res.data;
  },

  async getExamInstructions(id) {
    const res = await api.get(`/exams/${id}/instructions`);
    return res.data;
  },

  async createExam(examData) {
    const res = await api.post('/exams', examData);
    return res.data;
  },

  async updateExam(id, examData) {
    const res = await api.put(`/exams/${id}`, examData);
    return res.data;
  },

  async deleteExam(id) {
    const res = await api.delete(`/exams/${id}`);
    return res.data;
  }
};

import { api } from './api';

export const questionService = {
  async getQuestionsByExam(examId) {
    const res = await api.get(`/exams/${examId}/questions`);
    return res.data;
  },

  async getQuestionById(id) {
    const res = await api.get(`/questions/${id}`);
    return res.data;
  },

  async addQuestion(examId, questionData) {
    const res = await api.post(`/exams/${examId}/questions`, questionData);
    return res.data;
  },

  async updateQuestion(id, questionData) {
    const res = await api.put(`/questions/${id}`, questionData);
    return res.data;
  },

  async deleteQuestion(id) {
    const res = await api.delete(`/questions/${id}`);
    return res.data;
  }
};

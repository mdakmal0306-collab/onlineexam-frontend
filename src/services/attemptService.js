import { api } from './api';

export const attemptService = {
  async startExam(examId) {
    const res = await api.post(`/exams/${examId}/start`, {});
    return res.data;
  },

  async getAttemptDetails(attemptId) {
    const res = await api.get(`/attempts/${attemptId}`);
    return res.data;
  },

  async saveAnswer(attemptId, questionId, selectedAnswer) {
    const res = await api.put(`/attempts/${attemptId}/answers/${questionId}`, { selectedAnswer });
    return res.data;
  },

  async submitExam(attemptId, answersList) {
    const res = await api.post(`/attempts/${attemptId}/submit`, { answers: answersList });
    return res.data;
  }
};

import { api } from './api';

export const adminService = {
  async getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getAllStudents() {
    const res = await api.get('/students');
    return res.data;
  },

  async deleteStudent(id) {
    const res = await api.delete(`/students/${id}`);
    return res.data;
  },

  async getExamStatistics() {
    const res = await api.get('/admin/statistics');
    return res.data;
  },

  async getExamStatById(examId) {
    const res = await api.get(`/admin/statistics/exams/${examId}`);
    return res.data;
  }
};

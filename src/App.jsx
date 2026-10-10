import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import Contact from './pages/Contact';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import AvailableExams from './pages/AvailableExams';
import ExamInstructions from './pages/ExamInstructions';
import TakeExam from './pages/TakeExam';
import Result from './pages/Result';
import ExamHistory from './pages/ExamHistory';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageExams from './pages/ManageExams';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';
import ManageQuestions from './pages/ManageQuestions';
import AddQuestion from './pages/AddQuestion';
import EditQuestion from './pages/EditQuestion';
import StudentManagement from './pages/StudentManagement';
import ResultsManagement from './pages/ResultsManagement';
import ExamStatistics from './pages/ExamStatistics';

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/exams" element={<AvailableExams />} />
            <Route path="/student/exams/:id/instructions" element={<ExamInstructions />} />
            <Route path="/student/exam/:attemptId" element={<TakeExam />} />
            <Route path="/student/results/:resultId" element={<Result />} />
            <Route path="/student/history" element={<ExamHistory />} />
            <Route path="/student/profile" element={<Profile />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/exams" element={<ManageExams />} />
            <Route path="/admin/exams/create" element={<CreateExam />} />
            <Route path="/admin/exams/edit/:id" element={<EditExam />} />
            <Route path="/admin/exams/:examId/questions" element={<ManageQuestions />} />
            <Route path="/admin/exams/:examId/questions/add" element={<AddQuestion />} />
            <Route path="/admin/exams/:examId/questions/edit/:id" element={<EditQuestion />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route path="/admin/results" element={<ResultsManagement />} />
            <Route path="/admin/statistics" element={<ExamStatistics />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

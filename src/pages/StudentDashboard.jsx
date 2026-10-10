import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examService } from '../services/examService';
import { resultService } from '../services/resultService';
import StatCard from '../components/StatCard';
import { BookOpen, Clock, Award, CheckCircle2, ArrowRight, Play, UserCheck, Calendar } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [examsData, resultsData] = await Promise.all([
          examService.getAvailableExams(),
          resultService.getMyResults()
        ]);
        setExams(examsData || []);
        setResults(resultsData || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalAttempted = results.length;
  const passedCount = results.filter(r => r.resultStatus === 'PASS').length;
  const avgPercentage = totalAttempted > 0 
    ? Math.round((results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempted) * 10) / 10 
    : 0;

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--slate-500)', fontWeight: 600 }}>Loading student dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '1rem' }}>
      {/* Welcome Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name || 'Student'}!</h1>
          <p className="page-subtitle">
            Student ID: <strong>{user?.studentId || 'N/A'}</strong> &bull; Email: {user?.email}
          </p>
        </div>
        <Link to="/student/exams" className="btn btn-primary">
          <BookOpen size={18} /> View All Examinations
        </Link>
      </div>

      {/* Quick Metrics */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard 
          label="Available Exams" 
          value={exams.length} 
          icon={<BookOpen size={24} />} 
          color="blue" 
        />
        <StatCard 
          label="Exams Attempted" 
          value={totalAttempted} 
          icon={<Clock size={24} />} 
          color="amber" 
        />
        <StatCard 
          label="Passed Tests" 
          value={passedCount} 
          icon={<CheckCircle2 size={24} />} 
          color="green" 
        />
        <StatCard 
          label="Average Score" 
          value={`${avgPercentage}%`} 
          icon={<Award size={24} />} 
          color="blue" 
        />
      </div>

      {/* Available Exams & Recent Activity */}
      <div className="grid-2">
        {/* Available Exams Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active & Upcoming Examinations</h2>
            <Link to="/student/exams" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          {exams.length === 0 ? (
            <p style={{ color: 'var(--slate-500)', fontSize: '0.925rem' }}>No examinations currently open.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {exams.slice(0, 4).map(exam => (
                <div 
                  key={exam.id} 
                  style={{ 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--slate-200)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--slate-50)'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{exam.title}</h3>
                    <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', display: 'flex', gap: '1rem' }}>
                      <span>Subject: {exam.subject}</span>
                      <span>Duration: {exam.duration} mins</span>
                      <span>Marks: {exam.totalMarks}</span>
                    </div>
                  </div>

                  <Link 
                    to={`/student/exams/${exam.id}/instructions`} 
                    className="btn btn-primary btn-sm"
                  >
                    <Play size={14} /> Start Exam
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Examination Results</h2>
            <Link to="/student/history" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Full History &rarr;
            </Link>
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)' }}>
              <p>You have not submitted any examinations yet.</p>
              <Link to="/student/exams" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}>
                Browse Examinations
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.slice(0, 4).map(res => (
                <div 
                  key={res.id} 
                  style={{ 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--slate-200)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--slate-50)'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{res.examName}</h3>
                    <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', display: 'flex', gap: '1rem' }}>
                      <span>Score: {res.obtainedMarks} / {res.totalMarks} ({res.percentage}%)</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${res.resultStatus === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                      {res.resultStatus}
                    </span>
                    <Link to={`/student/results/${res.id}`} className="btn btn-secondary btn-sm">
                      View Result
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

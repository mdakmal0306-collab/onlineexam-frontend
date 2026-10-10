import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examService } from '../services/examService';
import { BookOpen, Clock, Award, Play, AlertCircle } from 'lucide-react';

export default function AvailableExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchExams() {
      try {
        const data = await examService.getAvailableExams();
        setExams(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load examinations');
      } finally {
        setLoading(false);
      }
    }
    fetchExams();
  }, []);

  return (
    <div className="container" style={{ marginTop: '1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Available Examinations</h1>
          <p className="page-subtitle">Select an active examination to read its instructions and begin testing</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--slate-500)' }}>
          <p>Loading available examinations...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--danger-700)' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
          <p>{error}</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <BookOpen size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Active Examinations</h3>
          <p style={{ color: 'var(--slate-500)', maxWidth: '400px', margin: '0 auto' }}>
            There are currently no active examinations scheduled. Please check back later or contact your instructor.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {exams.map(exam => (
            <div key={exam.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className={`badge ${exam.status === 'ACTIVE' ? 'badge-active' : 'badge-upcoming'}`}>
                  {exam.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                  {exam.questionCount ? `${exam.questionCount} Questions` : 'MCQ Exam'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--navy-900)' }}>
                {exam.title}
              </h2>

              <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginBottom: '1.25rem', flex: 1 }}>
                {exam.description || `Assessment covering ${exam.subject} syllabus.`}
              </p>

              <div style={{ 
                borderTop: '1px solid var(--slate-100)', 
                borderBottom: '1px solid var(--slate-100)', 
                padding: '0.75rem 0', 
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                fontSize: '0.825rem',
                color: 'var(--navy-700)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} color="var(--primary-600)" />
                  <span>{exam.duration} Minutes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={15} color="var(--primary-600)" />
                  <span>{exam.totalMarks} Marks (Pass: {exam.passingMarks})</span>
                </div>
              </div>

              <Link 
                to={`/student/exams/${exam.id}/instructions`} 
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Play size={16} /> View Instructions & Start
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

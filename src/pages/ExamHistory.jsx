import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultService } from '../services/resultService';
import { Clock, Award, Eye, FileText, AlertCircle } from 'lucide-react';

export default function ExamHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await resultService.getMyHistory();
        setHistory(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="container" style={{ marginTop: '1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Examination History & Results</h1>
          <p className="page-subtitle">Detailed record of all your completed examinations and scores</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--slate-500)' }}>
          <p>Loading examination records...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ color: 'var(--danger-700)', padding: '2rem', textAlign: 'center' }}>
          <p>{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Examination History</h3>
          <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>You have not attempted any examinations yet.</p>
          <Link to="/student/exams" className="btn btn-primary">
            Browse Available Examinations
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Exam Title</th>
                <th>Subject</th>
                <th>Attempted Date</th>
                <th>Questions</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.examName}</strong>
                  </td>
                  <td>{item.examSubject}</td>
                  <td>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    {item.attemptedQuestions} / {item.totalQuestions}
                  </td>
                  <td>
                    <strong>{item.obtainedMarks}</strong> / {item.totalMarks}
                  </td>
                  <td>
                    <strong>{item.percentage}%</strong>
                  </td>
                  <td>
                    <span className={`badge ${item.resultStatus === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                      {item.resultStatus}
                    </span>
                  </td>
                  <td>
                    <Link to={`/student/results/${item.id}`} className="btn btn-secondary btn-sm">
                      <Eye size={14} /> View Result
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { adminService } from '../services/adminService';
import StatCard from '../components/StatCard';
import { BarChart3, TrendingUp, Award, Users, CheckCircle, XCircle } from 'lucide-react';

export default function ExamStatistics() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await adminService.getExamStatistics();
        setStats(data || []);
      } catch (err) {
        console.error('Failed to load examination statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--slate-500)' }}>Calculating statistical analytics...</p>
        </main>
      </div>
    );
  }

  const totalAttemptsAcrossAll = stats.reduce((acc, s) => acc + s.totalAttempts, 0);
  const totalPassedAcrossAll = stats.reduce((acc, s) => acc + s.passedCount, 0);
  const aggregatePassRate = totalAttemptsAcrossAll > 0 
    ? Math.round((totalPassedAcrossAll / totalAttemptsAcrossAll) * 1000) / 10 
    : 0;

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Examination Statistics & Analytics</h1>
            <p className="page-subtitle">Pass/fail rates, average scores, and student participation metrics across examinations</p>
          </div>
        </div>

        {/* Global Summary */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <StatCard 
            label="Total Attempts" 
            value={totalAttemptsAcrossAll} 
            icon={<Users size={24} />} 
            color="blue" 
          />
          <StatCard 
            label="Passed Candidates" 
            value={totalPassedAcrossAll} 
            icon={<CheckCircle size={24} />} 
            color="green" 
          />
          <StatCard 
            label="Aggregate Pass Rate" 
            value={`${aggregatePassRate}%`} 
            icon={<TrendingUp size={24} />} 
            color="amber" 
          />
        </div>

        {/* Exam Breakdown Cards / Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Performance Breakdown by Examination</h2>
          </div>

          {stats.length === 0 ? (
            <p style={{ color: 'var(--slate-500)', padding: '1rem 0' }}>No examinations recorded yet.</p>
          ) : (
            <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Examination & Subject</th>
                    <th>Attempts</th>
                    <th>Passed / Failed</th>
                    <th>Pass Rate %</th>
                    <th>Average Score</th>
                    <th>Highest Score</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map(s => (
                    <tr key={s.examId}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--navy-900)' }}>{s.examTitle}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{s.subject}</span>
                      </td>
                      <td>
                        <strong>{s.totalAttempts}</strong>
                      </td>
                      <td>
                        <span style={{ color: 'var(--success-600)', fontWeight: 600 }}>{s.passedCount} Pass</span> / <span style={{ color: 'var(--danger-600)' }}>{s.failedCount} Fail</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '60px', height: '6px', background: 'var(--slate-200)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${s.passRate}%`, height: '100%', background: s.passRate >= 50 ? 'var(--success-500)' : 'var(--danger-500)' }}></div>
                          </div>
                          <strong>{s.passRate}%</strong>
                        </div>
                      </td>
                      <td>
                        <strong>{s.averageMarks}</strong> / {s.totalMarks}
                      </td>
                      <td>
                        <span className="badge badge-active">{s.highestMarks} Marks</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

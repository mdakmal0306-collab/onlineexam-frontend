import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { adminService } from '../services/adminService';
import { 
  Users, 
  FileText, 
  HelpCircle, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  PlusCircle,
  Eye,
  BarChart2
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--slate-500)', fontWeight: 600 }}>Loading administration analytics...</p>
        </main>
      </div>
    );
  }

  const passRate = stats?.totalResults > 0 
    ? Math.round(((stats.passCount || 0) / stats.totalResults) * 1000) / 10 
    : 0;

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Real-time overview of examinations, questions, student enrollment, and evaluation metrics</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/exams/create" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Create New Exam
            </Link>
          </div>
        </div>

        {/* Primary Statistics Grid */}
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <StatCard 
            label="Registered Students" 
            value={stats?.totalStudents || 0} 
            icon={<Users size={24} />} 
            color="blue" 
          />
          <StatCard 
            label="Total Examinations" 
            value={stats?.totalExams || 0} 
            icon={<FileText size={24} />} 
            color="amber" 
          />
          <StatCard 
            label="Total Questions" 
            value={stats?.totalQuestions || 0} 
            icon={<HelpCircle size={24} />} 
            color="blue" 
          />
          <StatCard 
            label="Exam Submissions" 
            value={stats?.totalResults || 0} 
            icon={<Award size={24} />} 
            color="green" 
          />
        </div>

        {/* Exam Status & Pass/Fail Breakdown Grid */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
              Examinations by Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-active">Active</span>
                <strong>{stats?.activeExams || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-upcoming">Upcoming</span>
                <strong>{stats?.upcomingExams || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-completed">Completed</span>
                <strong>{stats?.completedExams || 0}</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
              Performance Metrics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Overall Pass Rate</span>
                <strong style={{ color: 'var(--success-600)', fontSize: '1.1rem' }}>{passRate}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Average Score</span>
                <strong style={{ color: 'var(--primary-700)', fontSize: '1.1rem' }}>{stats?.averagePercentage || 0}%</strong>
              </div>
              {/* Visual Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${passRate}%`, height: '100%', background: 'var(--success-500)' }}></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
              Outcome Breakdown
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '80px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success-600)' }}>
                  {stats?.passCount || 0}
                </span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>PASSED</span>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'var(--slate-200)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger-600)' }}>
                  {stats?.failCount || 0}
                </span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>FAILED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Grid: Recent Exams & Recent Results */}
        <div className="grid-2">
          {/* Recent Examinations */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Examinations</h2>
              <Link to="/admin/exams" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Manage All &rarr;
              </Link>
            </div>

            {(!stats?.recentExams || stats.recentExams.length === 0) ? (
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>No examinations created yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.recentExams.map(e => (
                  <div 
                    key={e.id}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--slate-50)',
                      border: '1px solid var(--slate-200)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.925rem', color: 'var(--navy-900)' }}>{e.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{e.subject} &bull; {e.duration} mins</span>
                    </div>
                    <Link to={`/admin/exams/${e.id}/questions`} className="btn btn-secondary btn-sm">
                      Questions ({e.questionCount || 0})
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Student Submissions</h2>
              <Link to="/admin/results" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                All Results &rarr;
              </Link>
            </div>

            {(!stats?.recentResults || stats.recentResults.length === 0) ? (
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>No exam submissions yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.recentResults.map(r => (
                  <div 
                    key={r.id}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--slate-50)',
                      border: '1px solid var(--slate-200)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.925rem', color: 'var(--navy-900)' }}>{r.studentName}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{r.examName} &bull; Score: {r.obtainedMarks}/{r.totalMarks} ({r.percentage}%)</span>
                    </div>
                    <span className={`badge ${r.resultStatus === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                      {r.resultStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

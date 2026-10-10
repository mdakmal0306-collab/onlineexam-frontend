import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  Award, 
  CheckCircle2, 
  BarChart2, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();

  return (
    <div className="container" style={{ marginTop: '1.5rem' }}>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Modern & Secure Online Examination System
        </h1>
        <p className="hero-subtitle">
          A full-featured Java Spring Boot and React enterprise examination platform. 
          Real-time timers, automatic objective evaluation, strict role-based access, and instant result analytics.
        </p>

        <div className="hero-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-primary btn-lg">
                Student / Admin Login <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
                Register as Student
              </Link>
            </>
          ) : isStudent ? (
            <Link to="/student/dashboard" className="btn btn-primary btn-lg">
              Go to Student Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <Link to="/admin/dashboard" className="btn btn-primary btn-lg">
              Go to Admin Dashboard <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Platform Features</h2>
          <p style={{ color: 'var(--slate-500)' }}>Engineered for academic integrity, speed, and real-time reliability.</p>
        </div>

        <div className="grid-3">
          <div className="card card-hover">
            <div className="stat-icon stat-icon-blue" style={{ marginBottom: '1rem' }}>
              <Clock size={24} />
            </div>
            <h3 className="card-title">Server-Enforced Timers</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.925rem', marginTop: '0.5rem' }}>
              Server-authoritative countdown timers ensure fair examination deadlines. Automatic submission triggers when time expires.
            </p>
          </div>

          <div className="card card-hover">
            <div className="stat-icon stat-icon-green" style={{ marginBottom: '1rem' }}>
              <Award size={24} />
            </div>
            <h3 className="card-title">Instant Automated Evaluation</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.925rem', marginTop: '0.5rem' }}>
              Submissions are evaluated server-side against protected answer keys. Immediate score, percentage, and pass/fail calculations.
            </p>
          </div>

          <div className="card card-hover">
            <div className="stat-icon stat-icon-amber" style={{ marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 className="card-title">Answer Concealment & Security</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.925rem', marginTop: '0.5rem' }}>
              Zero-leakage DTO architecture ensures correct answers are never sent to students prior to formal evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* User Roles Overview */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="grid-2">
          <div className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="stat-icon stat-icon-blue"><GraduationCap size={24} /></div>
              <h3 className="card-title">Student Module</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--navy-700)', fontSize: '0.925rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary-600)" /> Browse upcoming and active examinations</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary-600)" /> Read instructions and start time-limited tests</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary-600)" /> Previous / Next navigation with continuous auto-save</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary-600)" /> Comprehensive result cards and historical records</li>
            </ul>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--navy-900)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="stat-icon stat-icon-amber"><BarChart2 size={24} /></div>
              <h3 className="card-title">Administrator Module</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--navy-700)', fontSize: '0.925rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--warning-600)" /> Full CRUD management for exams and subjects</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--warning-600)" /> 4-option MCQ question builder with mark weighting</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--warning-600)" /> Student directory & submission results tracking</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--warning-600)" /> Participation, pass-rate, and average mark analytics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Demo Credentials Info Banner */}
      <div className="card" style={{ background: 'var(--primary-50)', borderColor: 'var(--primary-200)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Development Demo Credentials</h4>
            <p style={{ color: 'var(--primary-800)', fontSize: '0.9rem' }}>
              <strong>Admin:</strong> admin@example.com / admin123 &nbsp;|&nbsp; <strong>Student:</strong> student@example.com / student123
            </p>
          </div>
          <Link to="/login" className="btn btn-primary btn-sm">Sign In Now</Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import Notification from '../components/Notification';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email/student ID and password');
      return;
    }

    setLoading(true);
    try {
      const userData = await login(formData);
      if (userData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@example.com', password: 'admin123' });
    } else {
      setFormData({ email: 'student@example.com', password: 'student123' });
    }
    setError('');
  };

  return (
    <div className="container-sm" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="stat-icon stat-icon-blue" style={{ margin: '0 auto 1rem auto' }}>
            <LogIn size={24} />
          </div>
          <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Account Login</h1>
          <p className="page-subtitle">Access your examination dashboard & records</p>
        </div>

        {error && (
          <Notification type="error" message={error} onClose={() => setError('')} />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">Email or Student ID</label>
            <input
              id="loginEmail"
              type="text"
              name="email"
              className="form-input"
              placeholder="e.g. student@example.com or STU001"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Login Credentials Bar */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--slate-300)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-700)', marginBottom: '0.5rem' }}>
            <Sparkles size={16} color="var(--primary-600)" />
            <span>Quick Demo Credentials</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemoCredentials('student')}
            >
              Fill Student (student@example.com)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemoCredentials('admin')}
            >
              Fill Admin (admin@example.com)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.925rem', color: 'var(--slate-500)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User, Lock, Phone, Mail, Hash, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Notification from '../components/Notification';

export default function Profile() {
  const { user, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      await authService.updateProfile(formData);
      await refreshProfile();
      setSuccessMsg('Profile and account details updated successfully.');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '1.5rem', maxWidth: '750px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Account Profile</h1>
          <p className="page-subtitle">View and update your personal and authentication details</p>
        </div>
      </div>

      {successMsg && <Notification type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Notification type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      <div className="card" style={{ padding: '2rem' }}>
        {/* Readonly Account Attributes */}
        <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--slate-200)' }}>
          <div className="grid-2" style={{ gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block' }}>Student ID</span>
              <strong style={{ color: 'var(--navy-900)' }}>{user?.studentId || 'N/A (Admin)'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block' }}>Email Address</span>
              <strong style={{ color: 'var(--navy-900)' }}>{user?.email}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block' }}>Assigned Role</span>
              <span className="badge badge-role">{user?.role}</span>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)', display: 'block' }}>Account Registered</span>
              <strong style={{ color: 'var(--navy-900)' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </strong>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Update Personal Information</h3>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <h3 style={{ fontSize: '1.15rem', margin: '2rem 0 1.25rem' }}>Change Password (Optional)</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Required if changing password"
                value={formData.currentPassword}
                onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={formData.newPassword}
                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Updating Account...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

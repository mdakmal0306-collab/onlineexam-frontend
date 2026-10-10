import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { examService } from '../services/examService';
import Notification from '../components/Notification';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    examDate: '',
    startTime: '',
    duration: 30,
    totalMarks: 25,
    passingMarks: 10,
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    async function loadExam() {
      try {
        const data = await examService.getExamById(id);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          subject: data.subject || '',
          examDate: data.examDate || '',
          startTime: data.startTime ? data.startTime.substring(0, 5) : '',
          duration: data.duration || 30,
          totalMarks: data.totalMarks || 25,
          passingMarks: data.passingMarks || 10,
          status: data.status || 'ACTIVE'
        });
      } catch (err) {
        setServerError(err.message || 'Failed to load examination');
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.duration || formData.duration <= 0) errs.duration = 'Duration must be > 0';
    if (!formData.totalMarks || formData.totalMarks <= 0) errs.totalMarks = 'Total marks must be > 0';
    if (!formData.passingMarks || formData.passingMarks <= 0) errs.passingMarks = 'Passing marks must be > 0';
    if (Number(formData.passingMarks) > Number(formData.totalMarks)) {
      errs.passingMarks = 'Passing marks cannot exceed total marks';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSaving(true);
    try {
      await examService.updateExam(id, formData);
      navigate('/admin/exams');
    } catch (err) {
      setServerError(err.message || 'Failed to update examination.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--slate-500)' }}>Loading examination details...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/admin/exams" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Exams
          </Link>
        </div>

        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Examination</h1>
            <p className="page-subtitle">Update schedule, time limit, passing criteria, and status</p>
          </div>
        </div>

        {serverError && (
          <Notification type="error" message={serverError} onClose={() => setServerError('')} />
        )}

        <div className="card" style={{ maxWidth: '800px', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Examination Title *</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                className="form-input"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows="3"
                className="form-textarea"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Exam Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.examDate}
                  onChange={e => setFormData({ ...formData, examDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.startTime}
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-3" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Duration (Minutes) *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                />
                {errors.duration && <span className="form-error">{errors.duration}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Total Marks *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.totalMarks}
                  onChange={e => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                />
                {errors.totalMarks && <span className="form-error">{errors.totalMarks}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Passing Marks *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.passingMarks}
                  onChange={e => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                />
                {errors.passingMarks && <span className="form-error">{errors.passingMarks}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="UPCOMING">UPCOMING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Update Examination'}
              </button>
              <Link to="/admin/exams" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

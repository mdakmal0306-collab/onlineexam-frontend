import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { examService } from '../services/examService';
import Notification from '../components/Notification';
import { PlusCircle, ArrowLeft, Save } from 'lucide-react';

export default function CreateExam() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    examDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: 30,
    totalMarks: 25,
    passingMarks: 10,
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

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

    setLoading(true);
    try {
      const created = await examService.createExam(formData);
      navigate(`/admin/exams/${created.id}/questions`);
    } catch (err) {
      setServerError(err.message || 'Failed to create examination.');
      setLoading(false);
    }
  };

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
            <h1 className="page-title">Create New Examination</h1>
            <p className="page-subtitle">Configure examination details, duration, passing marks, and schedule</p>
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
                placeholder="e.g. Java Full Stack Midterm Examination"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Course Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science - CS302"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description / Instructions</label>
              <textarea
                rows="3"
                className="form-textarea"
                placeholder="Brief summary or guidelines for candidates..."
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
                <option value="ACTIVE">ACTIVE (Open for student attempts)</option>
                <option value="UPCOMING">UPCOMING (Scheduled for future)</option>
                <option value="COMPLETED">COMPLETED (Closed)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={16} /> {loading ? 'Saving Exam...' : 'Save & Add Questions'}
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

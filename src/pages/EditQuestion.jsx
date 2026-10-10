import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { questionService } from '../services/questionService';
import Notification from '../components/Notification';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditQuestion() {
  const { examId, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 1
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    async function loadQuestion() {
      try {
        const data = await questionService.getQuestionById(id);
        setFormData({
          questionText: data.questionText || '',
          optionA: data.optionA || '',
          optionB: data.optionB || '',
          optionC: data.optionC || '',
          optionD: data.optionD || '',
          correctAnswer: data.correctAnswer || 'A',
          marks: data.marks || 1
        });
      } catch (err) {
        setServerError(err.message || 'Failed to load question details');
      } finally {
        setLoading(false);
      }
    }
    loadQuestion();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!formData.questionText.trim()) errs.questionText = 'Question text is required';
    if (!formData.optionA.trim()) errs.optionA = 'Option A is required';
    if (!formData.optionB.trim()) errs.optionB = 'Option B is required';
    if (!formData.optionC.trim()) errs.optionC = 'Option C is required';
    if (!formData.optionD.trim()) errs.optionD = 'Option D is required';
    if (!formData.marks || formData.marks <= 0) errs.marks = 'Marks must be at least 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSaving(true);
    try {
      await questionService.updateQuestion(id, formData);
      navigate(`/admin/exams/${examId}/questions`);
    } catch (err) {
      setServerError(err.message || 'Failed to update question');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--slate-500)' }}>Loading question...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ marginBottom: '1rem' }}>
          <Link to={`/admin/exams/${examId}/questions`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Questions
          </Link>
        </div>

        <div className="page-header">
          <div>
            <h1 className="page-title">Edit MCQ Question</h1>
            <p className="page-subtitle">Update question text, choices, correct key, and score weighting</p>
          </div>
        </div>

        {serverError && (
          <Notification type="error" message={serverError} onClose={() => setServerError('')} />
        )}

        <div className="card" style={{ maxWidth: '800px', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Question Text *</label>
              <textarea
                rows="3"
                className="form-textarea"
                value={formData.questionText}
                onChange={e => setFormData({ ...formData, questionText: e.target.value })}
              ></textarea>
              {errors.questionText && <span className="form-error">{errors.questionText}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Option A *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.optionA}
                  onChange={e => setFormData({ ...formData, optionA: e.target.value })}
                />
                {errors.optionA && <span className="form-error">{errors.optionA}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Option B *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.optionB}
                  onChange={e => setFormData({ ...formData, optionB: e.target.value })}
                />
                {errors.optionB && <span className="form-error">{errors.optionB}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Option C *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.optionC}
                  onChange={e => setFormData({ ...formData, optionC: e.target.value })}
                />
                {errors.optionC && <span className="form-error">{errors.optionC}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Option D *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.optionD}
                  onChange={e => setFormData({ ...formData, optionD: e.target.value })}
                />
                {errors.optionD && <span className="form-error">{errors.optionD}</span>}
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">Correct Answer Key *</label>
                <select
                  className="form-select"
                  value={formData.correctAnswer}
                  onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Marks Awarded *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.marks}
                  onChange={e => setFormData({ ...formData, marks: Number(e.target.value) })}
                />
                {errors.marks && <span className="form-error">{errors.marks}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Update Question'}
              </button>
              <Link to={`/admin/exams/${examId}/questions`} className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

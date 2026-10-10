import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { examService } from '../services/examService';
import { attemptService } from '../services/attemptService';
import { AlertCircle, Clock, Award, ShieldAlert, CheckCircle2, Play, ArrowLeft } from 'lucide-react';
import Notification from '../components/Notification';

export default function ExamInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    async function loadExam() {
      try {
        const data = await examService.getExamById(id);
        setExam(data);
      } catch (err) {
        setError(err.message || 'Failed to load examination instructions');
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [id]);

  const handleStartExam = async () => {
    if (!agreed) {
      setError('Please check the confirmation box acknowledging the rules before proceeding.');
      return;
    }

    setStarting(true);
    setError('');

    try {
      const attemptData = await attemptService.startExam(id);
      navigate(`/student/exam/${attemptData.attemptId}`, { state: { attempt: attemptData } });
    } catch (err) {
      setError(err.message || 'Unable to start examination.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--slate-500)' }}>Loading examination details...</p>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <AlertCircle size={32} color="var(--danger-600)" style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ color: 'var(--danger-700)' }}>{error}</p>
          <Link to="/student/exams" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
            Back to Available Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '1.5rem', maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/student/exams" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Exams
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <span className="badge badge-active" style={{ marginBottom: '0.5rem' }}>{exam.status}</span>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy-900)', marginBottom: '0.4rem' }}>{exam.title}</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Subject: <strong>{exam.subject}</strong></p>
        </div>

        {error && <Notification type="error" message={error} onClose={() => setError('')} />}

        {/* Exam Specifications */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>Duration</span>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginTop: '0.2rem' }}>{exam.duration} Mins</h3>
          </div>
          <div style={{ background: 'var(--slate-100)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--navy-600)', fontWeight: 600, textTransform: 'uppercase' }}>Total Marks</span>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginTop: '0.2rem' }}>{exam.totalMarks}</h3>
          </div>
          <div style={{ background: 'var(--success-50)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-700)', fontWeight: 600, textTransform: 'uppercase' }}>Passing Marks</span>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--success-700)', marginTop: '0.2rem' }}>{exam.passingMarks}</h3>
          </div>
        </div>

        {/* Rules & Guidelines */}
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>Important Examination Guidelines</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', color: 'var(--navy-700)', fontSize: '0.925rem' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <CheckCircle2 size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>This is a time-limited objective multiple-choice test. The countdown timer starts immediately once you click begin.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <CheckCircle2 size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Each question has 4 options (A, B, C, D) with exactly one correct answer.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <CheckCircle2 size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>You may navigate freely between questions using Previous and Next or the question grid palette.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <CheckCircle2 size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Your selected answers are saved continuously to the server. You can change your choice anytime before final submission.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <ShieldAlert size={18} color="var(--danger-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>When the timer expires, the test will be <strong>automatically submitted</strong> and evaluated by the server.</span>
          </li>
        </ul>

        {/* Declaration Checkbox */}
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          background: 'var(--slate-50)', 
          border: '1px solid var(--slate-300)',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}>
          <input 
            type="checkbox" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--navy-900)', fontWeight: 500 }}>
            I have read and understood all instructions. I am ready to begin the examination under timed conditions.
          </span>
        </label>

        {/* Start Button */}
        <button 
          onClick={handleStartExam} 
          className="btn btn-primary btn-lg" 
          style={{ width: '100%' }}
          disabled={starting}
        >
          {starting ? 'Starting Examination Session...' : (<><Play size={18} /> Begin Examination</>)}
        </button>
      </div>
    </div>
  );
}

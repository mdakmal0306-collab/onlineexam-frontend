import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { resultService } from '../services/resultService';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  BookOpen, 
  ArrowLeft,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Result() {
  const { resultId } = useParams();
  const location = useLocation();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(true);

  useEffect(() => {
    async function loadResult() {
      try {
        const data = await resultService.getResultById(resultId);
        setResult(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve result');
      } finally {
        setLoading(false);
      }
    }

    if (!result) {
      loadResult();
    }
  }, [resultId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--slate-500)', fontWeight: 600 }}>Loading examination result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <p style={{ color: 'var(--danger-700)', fontWeight: 600 }}>{error || 'Result not found'}</p>
          <Link to="/student/dashboard" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPass = result.resultStatus === 'PASS';

  return (
    <div className="container" style={{ marginTop: '1.5rem', maxWidth: '900px', marginBottom: '3rem' }}>
      {/* Back & Print Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/student/history" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Examination History
        </Link>
        <button onClick={handlePrint} className="btn btn-secondary btn-sm">
          <Printer size={16} /> Print Result Sheet
        </button>
      </div>

      {/* Main Result Banner */}
      <div className={`result-banner ${isPass ? 'result-banner-pass' : 'result-banner-fail'}`}>
        <span className={`badge ${isPass ? 'badge-pass' : 'badge-fail'}`}>
          {result.resultStatus}
        </span>
        <div className="score-display" style={{ color: isPass ? '#15803d' : '#b91c1c' }}>
          {result.obtainedMarks} <span style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--slate-500)' }}>/ {result.totalMarks}</span>
        </div>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: isPass ? '#166534' : '#991b1b', marginBottom: '0.25rem' }}>
          Percentage: {result.percentage}%
        </p>
        <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
          Required Passing Marks: <strong>{result.passingMarks || 0}</strong>
        </p>
      </div>

      {/* Examination & Student Info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
          <h2 className="card-title">Candidate & Exam Summary</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-400)' }}>
            Submitted: {result.createdAt ? new Date(result.createdAt).toLocaleString() : 'N/A'}
          </span>
        </div>

        <div className="grid-2" style={{ gap: '1rem', fontSize: '0.925rem' }}>
          <div>
            <p style={{ color: 'var(--slate-500)', marginBottom: '0.2rem' }}>Candidate Name</p>
            <strong style={{ color: 'var(--navy-900)' }}>{result.studentName}</strong>
          </div>
          <div>
            <p style={{ color: 'var(--slate-500)', marginBottom: '0.2rem' }}>Student ID</p>
            <strong style={{ color: 'var(--navy-900)' }}>{result.studentIdCode || 'N/A'}</strong>
          </div>
          <div>
            <p style={{ color: 'var(--slate-500)', marginBottom: '0.2rem' }}>Examination Title</p>
            <strong style={{ color: 'var(--navy-900)' }}>{result.examName}</strong>
          </div>
          <div>
            <p style={{ color: 'var(--slate-500)', marginBottom: '0.2rem' }}>Subject</p>
            <strong style={{ color: 'var(--navy-900)' }}>{result.examSubject}</strong>
          </div>
        </div>
      </div>

      {/* Detailed Question Statistics Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Questions</span>
            <span className="stat-value">{result.totalQuestions}</span>
          </div>
          <div className="stat-icon stat-icon-blue"><BookOpen size={22} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Correct</span>
            <span className="stat-value" style={{ color: '#15803d' }}>{result.correctAnswers}</span>
          </div>
          <div className="stat-icon stat-icon-green"><CheckCircle2 size={22} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Incorrect</span>
            <span className="stat-value" style={{ color: '#b91c1c' }}>{result.incorrectAnswers}</span>
          </div>
          <div className="stat-icon stat-icon-red"><XCircle size={22} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Unanswered</span>
            <span className="stat-value" style={{ color: '#d97706' }}>{result.unansweredQuestions}</span>
          </div>
          <div className="stat-icon stat-icon-amber"><HelpCircle size={22} /></div>
        </div>
      </div>

      {/* Answer Review Section */}
      {result.answerReviews && result.answerReviews.length > 0 && (
        <div className="card">
          <div 
            className="card-header" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setShowReview(!showReview)}
          >
            <h2 className="card-title">Detailed Question Review</h2>
            <button type="button" className="btn btn-secondary btn-sm">
              {showReview ? (<><ChevronUp size={16} /> Hide Review</>) : (<><ChevronDown size={16} /> Show Review</>)}
            </button>
          </div>

          {showReview && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
              {result.answerReviews.map((review, idx) => {
                const isCorrect = review.isCorrect;
                const isSkipped = !review.selectedAnswer;

                return (
                  <div 
                    key={review.questionId || idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isCorrect ? '#86efac' : isSkipped ? 'var(--slate-300)' : '#fca5a5'}`,
                      background: isCorrect ? '#f0fdf4' : isSkipped ? 'var(--slate-50)' : '#fef2f2'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        Question {idx + 1}
                      </span>
                      <span className={`badge ${isCorrect ? 'badge-pass' : isSkipped ? 'badge-completed' : 'badge-fail'}`}>
                        {isCorrect ? `+${review.marks} Marks` : isSkipped ? 'Skipped (0 Marks)' : 'Incorrect (0 Marks)'}
                      </span>
                    </div>

                    <p style={{ fontWeight: 600, color: 'var(--navy-900)', marginBottom: '1rem' }}>
                      {review.questionText}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {[
                        { key: 'A', text: review.optionA },
                        { key: 'B', text: review.optionB },
                        { key: 'C', text: review.optionC },
                        { key: 'D', text: review.optionD }
                      ].map(opt => {
                        const isThisCorrect = review.correctAnswer === opt.key;
                        const isThisSelected = review.selectedAnswer === opt.key;

                        let style = { padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', background: 'white' };
                        if (isThisCorrect) {
                          style = { ...style, background: '#dcfce7', borderColor: '#86efac', fontWeight: 600, color: '#15803d' };
                        } else if (isThisSelected && !isCorrect) {
                          style = { ...style, background: '#fee2e2', borderColor: '#fca5a5', color: '#b91c1c' };
                        }

                        return (
                          <div key={opt.key} style={style}>
                            <strong>{opt.key}:</strong> {opt.text}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: '0.85rem', display: 'flex', gap: '1.5rem', color: 'var(--navy-800)' }}>
                      <span>Your Answer: <strong>{review.selectedAnswer || 'Not Answered'}</strong></span>
                      <span>Correct Answer: <strong style={{ color: '#15803d' }}>{review.correctAnswer}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Action footer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/student/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
        <Link to="/student/exams" className="btn btn-secondary">
          Browse More Examinations
        </Link>
      </div>
    </div>
  );
}

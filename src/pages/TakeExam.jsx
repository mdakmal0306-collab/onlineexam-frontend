import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export default function TakeExam() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [attempt, setAttempt] = useState(location.state?.attempt || null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(!attempt);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeExpiredModal, setTimeExpiredModal] = useState(false);

  const timerRef = useRef(null);

  // Load attempt if not passed via location state
  useEffect(() => {
    async function loadAttempt() {
      try {
        const data = await attemptService.getAttemptDetails(attemptId);
        setAttempt(data);
        setQuestions(data.questions || []);
        setSelectedAnswers(data.savedAnswers || {});
        setRemainingSeconds(data.remainingSeconds || 0);
      } catch (err) {
        alert(err.message || 'Failed to load exam attempt');
        navigate('/student/exams');
      } finally {
        setLoading(false);
      }
    }

    if (!attempt) {
      loadAttempt();
    } else {
      setQuestions(attempt.questions || []);
      setSelectedAnswers(attempt.savedAnswers || {});
      setRemainingSeconds(attempt.remainingSeconds || 0);
      setLoading(false);
    }
  }, [attemptId]);

  // Server-synchronized Countdown Timer
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [remainingSeconds > 0]);

  const handleSelectOption = async (optionLetter) => {
    if (submitting) return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    // Toggle or select
    const newChoice = selectedAnswers[currentQ.id] === optionLetter ? null : optionLetter;

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: newChoice
    }));

    // Auto-save to backend asynchronously
    try {
      await attemptService.saveAnswer(attemptId, currentQ.id, newChoice);
    } catch (err) {
      console.warn('Auto-save answer failed:', err);
    }
  };

  const handleAutoSubmit = async () => {
    setTimeExpiredModal(true);
    await doSubmit();
  };

  const doSubmit = async () => {
    setSubmitting(true);
    setShowSubmitModal(false);

    try {
      const answersPayload = Object.entries(selectedAnswers).map(([qId, ans]) => ({
        questionId: Number(qId),
        selectedAnswer: ans
      }));

      const result = await attemptService.submitExam(attemptId, answersPayload);
      navigate(`/student/results/${result.id}`, { replace: true, state: { result } });
    } catch (err) {
      alert('Error submitting examination: ' + (err.message || 'Unknown error'));
      setSubmitting(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--slate-500)' }}>
        <p>Loading examination environment...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.values(selectedAnswers).filter(Boolean).length;
  const totalQuestions = questions.length;
  const isTimeCritical = remainingSeconds > 0 && remainingSeconds <= 120; // under 2 minutes

  return (
    <div className="exam-layout">
      {/* Exam Top Bar */}
      <header className="exam-topbar">
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>{attempt?.examTitle}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Candidate: <strong>{user?.name}</strong> ({user?.studentId}) &bull; Subject: {attempt?.examSubject}
          </span>
        </div>

        <div className={`timer-box ${isTimeCritical ? 'timer-warning' : ''}`}>
          <Clock size={20} />
          <span>Time Left: {formatTime(remainingSeconds)}</span>
        </div>
      </header>

      {/* Main Exam Area */}
      <div className="exam-body">
        {/* Left: Current Question Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="question-card">
            {/* Question Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '1rem' }}>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="badge badge-role">
                Marks: {currentQuestion?.marks || 1}
              </span>
            </div>

            {/* Question Text */}
            <p className="question-title">
              {currentQuestion?.questionText}
            </p>

            {/* Options List */}
            <div className="options-list">
              {[
                { key: 'A', text: currentQuestion?.optionA },
                { key: 'B', text: currentQuestion?.optionB },
                { key: 'C', text: currentQuestion?.optionC },
                { key: 'D', text: currentQuestion?.optionD }
              ].map(opt => {
                const isSelected = selectedAnswers[currentQuestion?.id] === opt.key;
                return (
                  <div
                    key={opt.key}
                    className={`option-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(opt.key)}
                  >
                    <div className="option-letter">{opt.key}</div>
                    <div style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>{opt.text}</div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons within Question Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--slate-200)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0 || submitting}
              >
                <ChevronLeft size={18} /> Previous Question
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {currentIndex < totalQuestions - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                    disabled={submitting}
                  >
                    Next Question <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    className="btn btn-success btn-lg"
                    onClick={() => setShowSubmitModal(true)}
                    disabled={submitting}
                  >
                    <Send size={18} /> Submit Examination
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Palette */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Question Palette</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
              <span>Answered: <strong>{answeredCount}</strong></span>
              <span>Remaining: <strong>{totalQuestions - answeredCount}</strong></span>
            </div>

            <div className="question-nav-grid">
              {questions.map((q, idx) => {
                const isAnswered = !!selectedAnswers[q.id];
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    className={`q-nav-btn ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                    disabled={submitting}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-200)' }}>
              <button
                className="btn btn-success"
                style={{ width: '100%' }}
                onClick={() => setShowSubmitModal(true)}
                disabled={submitting}
              >
                <Send size={16} /> Finish & Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Submit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSubmitModal}
        title="Submit Examination"
        message={`You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to finalize and submit your examination? You will not be able to modify your answers afterwards.`}
        confirmText="Yes, Submit Now"
        cancelText="Return to Test"
        onConfirm={doSubmit}
        onCancel={() => setShowSubmitModal(false)}
      />

      {/* Time Expired Modal */}
      {timeExpiredModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--danger-600)', margin: '0 auto 1rem' }}>
              <AlertTriangle size={48} />
            </div>
            <h2 className="modal-title">Time Has Expired!</h2>
            <p style={{ color: 'var(--slate-600)', margin: '0.5rem 0 1.5rem' }}>
              The examination time limit has reached zero. Your answers have been automatically submitted and evaluated by the server.
            </p>
            <div style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
              Redirecting to your result page...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

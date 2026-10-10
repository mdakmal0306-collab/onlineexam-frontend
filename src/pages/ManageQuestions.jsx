import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { questionService } from '../services/questionService';
import { examService } from '../services/examService';
import ConfirmationModal from '../components/ConfirmationModal';
import Notification from '../components/Notification';
import { PlusCircle, Edit, Trash2, ArrowLeft, HelpCircle } from 'lucide-react';

export default function ManageQuestions() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteQId, setDeleteQId] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadData = async () => {
    try {
      const [examData, qData] = await Promise.all([
        examService.getExamById(examId),
        questionService.getQuestionsByExam(examId)
      ]);
      setExam(examData);
      setQuestions(qData || []);
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to load questions' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [examId]);

  const handleDelete = async () => {
    if (!deleteQId) return;
    try {
      await questionService.deleteQuestion(deleteQId);
      setNotification({ type: 'success', message: 'Question deleted successfully.' });
      setDeleteQId(null);
      loadData();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete question.' });
      setDeleteQId(null);
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/admin/exams" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Manage Exams
          </Link>
        </div>

        <div className="page-header">
          <div>
            <h1 className="page-title">
              {exam ? `Questions: ${exam.title}` : 'Manage Questions'}
            </h1>
            <p className="page-subtitle">
              Subject: <strong>{exam?.subject}</strong> &bull; Total Questions: <strong>{questions.length}</strong> &bull; Exam Marks: <strong>{exam?.totalMarks}</strong>
            </p>
          </div>
          <Link to={`/admin/exams/${examId}/questions/add`} className="btn btn-primary">
            <PlusCircle size={18} /> Add New Question
          </Link>
        </div>

        {notification && (
          <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification(null)} 
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
            <p>Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <HelpCircle size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Questions Added Yet</h3>
            <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>Add multiple-choice questions with 4 options and correct answer keys.</p>
            <Link to={`/admin/exams/${examId}/questions/add`} className="btn btn-primary">
              <PlusCircle size={16} /> Add First Question
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map((q, idx) => (
              <div key={q.id} className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.95rem' }}>
                    Question {idx + 1}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-role">Marks: {q.marks}</span>
                    <Link 
                      to={`/admin/exams/${examId}/questions/edit/${q.id}`} 
                      className="btn btn-secondary btn-sm"
                      title="Edit Question"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    <button 
                      onClick={() => setDeleteQId(q.id)} 
                      className="btn btn-danger btn-sm"
                      title="Delete Question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '1.05rem', marginBottom: '1rem' }}>
                  {q.questionText}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: q.correctAnswer === 'A' ? '#dcfce7' : 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
                    <strong>A:</strong> {q.optionA}
                  </div>
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: q.correctAnswer === 'B' ? '#dcfce7' : 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
                    <strong>B:</strong> {q.optionB}
                  </div>
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: q.correctAnswer === 'C' ? '#dcfce7' : 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
                    <strong>C:</strong> {q.optionC}
                  </div>
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: q.correctAnswer === 'D' ? '#dcfce7' : 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
                    <strong>D:</strong> {q.optionD}
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--navy-700)' }}>
                  Correct Key: <strong style={{ color: '#15803d', fontSize: '0.95rem' }}>Option {q.correctAnswer}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmationModal
          isOpen={!!deleteQId}
          title="Delete Question"
          message="Are you sure you want to delete this question? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          isDanger={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteQId(null)}
        />
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { examService } from '../services/examService';
import ConfirmationModal from '../components/ConfirmationModal';
import Notification from '../components/Notification';
import { PlusCircle, Edit, Trash2, HelpCircle, FileText } from 'lucide-react';

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteExamId, setDeleteExamId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchExams = async () => {
    try {
      const data = await examService.getAllExams();
      setExams(data || []);
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to load exams' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async () => {
    if (!deleteExamId) return;
    try {
      await examService.deleteExam(deleteExamId);
      setNotification({ type: 'success', message: 'Examination deleted successfully.' });
      setDeleteExamId(null);
      fetchExams();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete examination.' });
      setDeleteExamId(null);
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Examinations</h1>
            <p className="page-subtitle">Create, configure, update, and manage question banks for examinations</p>
          </div>
          <Link to="/admin/exams/create" className="btn btn-primary">
            <PlusCircle size={18} /> Create Examination
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
            <p>Loading examinations...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <FileText size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Examinations Found</h3>
            <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>Get started by creating your first examination schedule.</p>
            <Link to="/admin/exams/create" className="btn btn-primary">
              <PlusCircle size={16} /> Create Exam
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title & Subject</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Total / Passing</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id}>
                    <td>
                      <strong style={{ display: 'block', color: 'var(--navy-900)' }}>{exam.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{exam.subject}</span>
                    </td>
                    <td>
                      <div>{exam.examDate || 'Open Schedule'}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{exam.startTime || ''}</span>
                    </td>
                    <td>{exam.duration} mins</td>
                    <td>
                      <strong>{exam.totalMarks}</strong> / Pass: {exam.passingMarks}
                    </td>
                    <td>
                      <Link 
                        to={`/admin/exams/${exam.id}/questions`} 
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <HelpCircle size={14} /> Questions ({exam.questionCount || 0})
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${
                        exam.status === 'ACTIVE' ? 'badge-active' :
                        exam.status === 'UPCOMING' ? 'badge-upcoming' : 'badge-completed'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/admin/exams/edit/${exam.id}`} className="btn btn-secondary btn-sm" title="Edit Exam">
                          <Edit size={14} /> Edit
                        </Link>
                        <button 
                          onClick={() => setDeleteExamId(exam.id)} 
                          className="btn btn-danger btn-sm"
                          title="Delete Exam"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmationModal
          isOpen={!!deleteExamId}
          title="Delete Examination"
          message="Are you sure you want to delete this examination and its associated questions? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          isDanger={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteExamId(null)}
        />
      </main>
    </div>
  );
}

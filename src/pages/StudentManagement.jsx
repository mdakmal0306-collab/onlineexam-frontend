import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { adminService } from '../services/adminService';
import ConfirmationModal from '../components/ConfirmationModal';
import Notification from '../components/Notification';
import { Users, Trash2, Mail, Phone, Hash, Search } from 'lucide-react';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchStudents = async () => {
    try {
      const data = await adminService.getAllStudents();
      setStudents(data || []);
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to load students' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async () => {
    if (!deleteStudentId) return;
    try {
      await adminService.deleteStudent(deleteStudentId);
      setNotification({ type: 'success', message: 'Student account deleted successfully.' });
      setDeleteStudentId(null);
      fetchStudents();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete student.' });
      setDeleteStudentId(null);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Student Management</h1>
            <p className="page-subtitle">View registered students, credentials, student IDs, and enrollment dates</p>
          </div>
        </div>

        {notification && (
          <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification(null)} 
          />
        )}

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={18} color="var(--slate-400)" />
            <input
              type="text"
              placeholder="Search by student name, ID, or email..."
              className="form-input"
              style={{ border: 'none', padding: '0.4rem', boxShadow: 'none' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
            <p>Loading student directory...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Users size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Students Found</h3>
            <p style={{ color: 'var(--slate-500)' }}>No student accounts match your filter criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-700)' }}>{student.studentId || 'N/A'}</strong>
                    </td>
                    <td>
                      <strong>{student.name}</strong>
                    </td>
                    <td>{student.email}</td>
                    <td>{student.phone || '—'}</td>
                    <td>
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <button 
                        onClick={() => setDeleteStudentId(student.id)} 
                        className="btn btn-danger btn-sm"
                        title="Delete Student"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmationModal
          isOpen={!!deleteStudentId}
          title="Delete Student Account"
          message="Are you sure you want to delete this student account? All their examination attempts and results will be removed permanently."
          confirmText="Yes, Delete Account"
          cancelText="Cancel"
          isDanger={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteStudentId(null)}
        />
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { resultService } from '../services/resultService';
import { examService } from '../services/examService';
import { Award, Search, Filter, Eye, FileText } from 'lucide-react';

export default function ResultsManagement() {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        const [resultsData, examsData] = await Promise.all([
          resultService.getAllResults(),
          examService.getAllExams()
        ]);
        setResults(resultsData || []);
        setExams(examsData || []);
      } catch (err) {
        console.error('Failed to load results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredResults = results.filter(r => {
    const matchesExam = selectedExamId === 'ALL' || String(r.examId) === String(selectedExamId);
    const matchesStatus = statusFilter === 'ALL' || r.resultStatus === statusFilter;
    const matchesSearch = 
      r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentIdCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.examName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesExam && matchesStatus && matchesSearch;
  });

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Examination Results Management</h1>
            <p className="page-subtitle">Inspect student submissions, score distributions, and individual response sheets</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div className="grid-3" style={{ gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Examination</label>
              <select
                className="form-select"
                value={selectedExamId}
                onChange={e => setSelectedExamId(e.target.value)}
              >
                <option value="ALL">All Examinations</option>
                {exams.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Status Filter</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Outcomes (PASS & FAIL)</option>
                <option value="PASS">PASS Only</option>
                <option value="FAIL">FAIL Only</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Candidate</label>
              <input
                type="text"
                placeholder="Search candidate name or ID..."
                className="form-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
            <p>Loading examination results...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Award size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Submissions Found</h3>
            <p style={{ color: 'var(--slate-500)' }}>No student results match the current filters.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID & Name</th>
                  <th>Exam Title</th>
                  <th>Attempt Date</th>
                  <th>Questions</th>
                  <th>Score / Total</th>
                  <th>Percentage</th>
                  <th>Outcome</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map(res => (
                  <tr key={res.id}>
                    <td>
                      <strong style={{ display: 'block', color: 'var(--navy-900)' }}>{res.studentName}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>{res.studentIdCode || 'N/A'}</span>
                    </td>
                    <td>
                      <div>{res.examName}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{res.examSubject}</span>
                    </td>
                    <td>
                      {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      {res.correctAnswers} correct / {res.totalQuestions}
                    </td>
                    <td>
                      <strong>{res.obtainedMarks}</strong> / {res.totalMarks}
                    </td>
                    <td>
                      <strong>{res.percentage}%</strong>
                    </td>
                    <td>
                      <span className={`badge ${res.resultStatus === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                        {res.resultStatus}
                      </span>
                    </td>
                    <td>
                      <Link to={`/student/results/${res.id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} /> Full Sheet
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

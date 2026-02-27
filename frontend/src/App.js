import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import StudentForm from './components/StudentForm';
import Dashboard from './components/Dashboard';
import * as api from './api';

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('students');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editStudent, setEditStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getStudents({ search, class: filterClass });
      setStudents(res.data.data);
    } catch { addToast('Failed to fetch students', 'error'); }
    finally { setLoading(false); }
  }, [search, filterClass]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.getStats();
      setStats(res.data.data);
    } catch {}
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { if (view === 'dashboard') fetchStats(); }, [view, fetchStats]);

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editStudent) {
        await api.updateStudent(editStudent.id, formData);
        addToast('Student updated successfully!');
      } else {
        await api.createStudent(formData);
        addToast('Student added successfully!');
      }
      setModal(null);
      setEditStudent(null);
      fetchStudents();
      fetchStats();
    } catch (err) {
      addToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteStudent(id);
      addToast('Student deleted successfully!');
      fetchStudents();
      fetchStats();
    } catch { addToast('Failed to delete student', 'error'); }
    finally { setDeleteConfirm(null); }
  };

  const openEdit = (student) => {
    setEditStudent(student);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditStudent(null);
  };

  const gradeClass = (g) => {
    if (!g) return '';
    if (g.startsWith('A')) return 'grade-A';
    if (g.startsWith('B')) return 'grade-B';
    if (g.startsWith('C')) return 'grade-C';
    return 'grade-D';
  };

  const classes = [...new Set(students.map(s => s.class))].sort();

  return (
    <div className="app">
      <nav className="navbar">
        <h1>📚 Student Management</h1>
        <div className="navbar-nav">
          <button className={`nav-btn ${view === 'students' ? 'active' : ''}`} onClick={() => setView('students')}>👥 Students</button>
          <button className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>📊 Dashboard</button>
        </div>
      </nav>

      <main className="main">
        {view === 'dashboard' ? (
          <Dashboard stats={stats} />
        ) : (
          <>
            <div className="controls">
              <div className="search-box">
                <span className="icon">🔍</span>
                <input
                  placeholder="Search by name, email, roll number..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select className="filter-select" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                <option value="">All Classes</option>
                {classes.map(c => <option key={c}>{c}</option>)}
              </select>
              <button className="btn btn-primary" onClick={() => setModal('add')}>
                ➕ Add Student
              </button>
            </div>

            <div className="table-wrapper">
              <div className="table-header">
                <h2>Students List</h2>
                <span className="badge">{students.length} students</span>
              </div>

              {loading ? (
                <div className="loading-wrap"><div className="spinner" /></div>
              ) : students.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">🎓</div>
                  <p>No students found. Add one to get started!</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Roll No.</th>
                      <th>Class</th>
                      <th>Section</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Grade</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div className="student-name">
                            <div className="avatar">{s.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <div className="name-text">{s.name}</div>
                              <div className="email-text">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><strong>{s.roll_number}</strong></td>
                        <td>{s.class}</td>
                        <td>{s.section || '—'}</td>
                        <td>{s.gender || '—'}</td>
                        <td>{s.phone || '—'}</td>
                        <td>
                          {s.grade
                            ? <span className={`grade-badge ${gradeClass(s.grade)}`}>{s.grade}</span>
                            : '—'}
                        </td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-edit btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(s)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>{modal === 'edit' ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <StudentForm
              student={editStudent}
              onSubmit={handleSubmit}
              onClose={closeModal}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>🗑️ Confirm Delete</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setDeleteConfirm(null)} style={{ background: '#f0f4f8', color: '#4a5568' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}

import React, { useState, useEffect } from 'react';

const CLASSES = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'];
const SECTIONS = ['A','B','C','D','E'];
const GRADES = ['A+','A','B+','B','C+','C','D','F'];

export default function StudentForm({ student, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    name: '', email: '', roll_number: '', class: '',
    section: '', phone: '', address: '', date_of_birth: '',
    gender: '', grade: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) setForm({ ...student });
  }, [student]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.roll_number.trim()) e.roll_number = 'Roll number is required';
    if (!form.class) e.class = 'Class is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const f = (name, label, type = 'text', opts = {}) => (
    <div className={`form-group ${opts.full ? 'full' : ''}`}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={form[name] || ''}
        onChange={handleChange}
        className={errors[name] ? 'error' : ''}
        placeholder={opts.placeholder || ''}
      />
      {errors[name] && <span className="error-msg">{errors[name]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-grid">
          {f('name', 'Full Name *', 'text', { placeholder: 'John Doe' })}
          {f('email', 'Email *', 'email', { placeholder: 'john@school.com' })}
          {f('roll_number', 'Roll Number *', 'text', { placeholder: 'R001' })}

          <div className="form-group">
            <label>Class *</label>
            <select name="class" value={form.class || ''} onChange={handleChange} className={errors.class ? 'error' : ''}>
              <option value="">Select Class</option>
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.class && <span className="error-msg">{errors.class}</span>}
          </div>

          <div className="form-group">
            <label>Section</label>
            <select name="section" value={form.section || ''} onChange={handleChange}>
              <option value="">Select Section</option>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender || ''} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {f('phone', 'Phone', 'tel', { placeholder: '9876543210' })}

          <div className="form-group">
            <label>Grade</label>
            <select name="grade" value={form.grade || ''} onChange={handleChange}>
              <option value="">Select Grade</option>
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          {f('date_of_birth', 'Date of Birth', 'date')}
          {f('address', 'Address', 'text', { placeholder: '123 Main St, City', full: true })}
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn" onClick={onClose} style={{ background: '#f0f4f8', color: '#4a5568' }}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : student ? '💾 Update Student' : '➕ Add Student'}
        </button>
      </div>
    </form>
  );
}

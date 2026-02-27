const db = require('../db');

// GET all students (with optional search)
const getAllStudents = (req, res) => {
  const { search, class: cls } = req.query;
  let query = 'SELECT * FROM students';
  const params = [];

  if (search || cls) {
    const conditions = [];
    if (search) {
      conditions.push(`(name LIKE ? OR email LIKE ? OR roll_number LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (cls) {
      conditions.push(`class = ?`);
      params.push(cls);
    }
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  const students = db.prepare(query).all(...params);
  res.json({ success: true, data: students, total: students.length });
};

// GET single student
const getStudentById = (req, res) => {
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
};

// POST create student
const createStudent = (req, res) => {
  const { name, email, roll_number, class: cls, section, phone, address, date_of_birth, gender, grade } = req.body;

  if (!name || !email || !roll_number || !cls) {
    return res.status(400).json({ success: false, message: 'Name, email, roll number and class are required' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO students (name, email, roll_number, class, section, phone, address, date_of_birth, gender, grade)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, roll_number, cls, section, phone, address, date_of_birth, gender, grade);

    const newStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newStudent, message: 'Student created successfully' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'Email or Roll Number already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update student
const updateStudent = (req, res) => {
  const { name, email, roll_number, class: cls, section, phone, address, date_of_birth, gender, grade } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ success: false, message: 'Student not found' });

  try {
    db.prepare(`
      UPDATE students SET
        name = ?, email = ?, roll_number = ?, class = ?, section = ?,
        phone = ?, address = ?, date_of_birth = ?, gender = ?, grade = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, email, roll_number, cls, section, phone, address, date_of_birth, gender, grade, id);

    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Student updated successfully' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'Email or Roll Number already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE student
const deleteStudent = (req, res) => {
  const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Student not found' });

  db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Student deleted successfully' });
};

// GET stats
const getStats = (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
  const byClass = db.prepare('SELECT class, COUNT(*) as count FROM students GROUP BY class ORDER BY class').all();
  const byGender = db.prepare('SELECT gender, COUNT(*) as count FROM students GROUP BY gender').all();
  const byGrade = db.prepare('SELECT grade, COUNT(*) as count FROM students GROUP BY grade ORDER BY grade').all();

  res.json({ success: true, data: { total, byClass, byGender, byGrade } });
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, getStats };

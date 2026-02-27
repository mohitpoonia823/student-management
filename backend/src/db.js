const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../students.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    roll_number TEXT UNIQUE NOT NULL,
    class TEXT NOT NULL,
    section TEXT,
    phone TEXT,
    address TEXT,
    date_of_birth TEXT,
    gender TEXT,
    grade TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed sample data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM students').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO students (name, email, roll_number, class, section, phone, gender, grade)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const samples = [
    ['Alice Johnson', 'alice@school.com', 'R001', '10th', 'A', '9876543210', 'Female', 'A'],
    ['Bob Smith', 'bob@school.com', 'R002', '10th', 'B', '9876543211', 'Male', 'B+'],
    ['Carol White', 'carol@school.com', 'R003', '11th', 'A', '9876543212', 'Female', 'A+'],
    ['David Brown', 'david@school.com', 'R004', '11th', 'C', '9876543213', 'Male', 'B'],
    ['Eva Green', 'eva@school.com', 'R005', '12th', 'A', '9876543214', 'Female', 'A'],
  ];
  samples.forEach(s => insert.run(...s));
}

module.exports = db;

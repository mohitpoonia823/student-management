# 📚 Student Management System

A full-stack Student Management System with a **Node.js/Express** backend and **React** frontend, organized as a monorepo.

## 📁 Project Structure

```
student-management/
├── backend/          # Express REST API + SQLite DB
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── db.js
│   ├── server.js
│   └── package.json
├── frontend/         # React App
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json      # Root scripts
└── README.md
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# From root
npm run install:all
```

### 2. Start Backend (runs on http://localhost:5000)

```bash
npm run dev:backend
```

### 3. Start Frontend (runs on http://localhost:3000)

```bash
npm run dev:frontend
```

## ✨ Features

- ➕ Add new students
- 📋 View all students in a table
- ✏️  Edit student details
- 🗑️ Delete students
- 🔍 Search/filter students
- 📊 Dashboard with stats

## 🛠️ Tech Stack

| Layer    | Technology              |
|----------|------------------------|
| Backend  | Node.js, Express, SQLite |
| Frontend | React, Axios, CSS      |
| Database | SQLite (via better-sqlite3) |

## 📡 API Endpoints

| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| GET    | /api/students      | Get all students    |
| GET    | /api/students/:id  | Get student by ID   |
| POST   | /api/students      | Create new student  |
| PUT    | /api/students/:id  | Update student      |
| DELETE | /api/students/:id  | Delete student      |
| GET    | /api/stats         | Get dashboard stats |

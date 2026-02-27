import React from 'react';

export default function Dashboard({ stats }) {
  if (!stats) return <div className="loading-wrap"><div className="spinner" /></div>;

  const topClass = stats.byClass.reduce((a, b) => a.count > b.count ? a : b, { class: '-', count: 0 });

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card purple">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-sub">Enrolled</span>
        </div>
        <div className="stat-card blue">
          <span className="stat-label">Classes</span>
          <span className="stat-value">{stats.byClass.length}</span>
          <span className="stat-sub">Active classes</span>
        </div>
        <div className="stat-card green">
          <span className="stat-label">Largest Class</span>
          <span className="stat-value">{topClass.class}</span>
          <span className="stat-sub">{topClass.count} students</span>
        </div>
        <div className="stat-card orange">
          <span className="stat-label">Grade Records</span>
          <span className="stat-value">{stats.byGrade.length}</span>
          <span className="stat-sub">Unique grades</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="table-wrapper">
          <div className="table-header"><h2>By Class</h2></div>
          <table>
            <thead><tr><th>Class</th><th>Students</th><th>Share</th></tr></thead>
            <tbody>
              {stats.byClass.map(r => (
                <tr key={r.class}>
                  <td><strong>{r.class}</strong></td>
                  <td><span className="badge">{r.count}</span></td>
                  <td>
                    <div style={{ background: '#e2e8f0', borderRadius: 4, height: 8, width: 100 }}>
                      <div style={{ background: '#667eea', borderRadius: 4, height: 8, width: `${(r.count / stats.total) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrapper">
          <div className="table-header"><h2>By Gender</h2></div>
          <table>
            <thead><tr><th>Gender</th><th>Students</th></tr></thead>
            <tbody>
              {stats.byGender.map(r => (
                <tr key={r.gender}>
                  <td>{r.gender || 'Not specified'}</td>
                  <td><span className="badge">{r.count}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrapper">
          <div className="table-header"><h2>By Grade</h2></div>
          <table>
            <thead><tr><th>Grade</th><th>Students</th></tr></thead>
            <tbody>
              {stats.byGrade.map(r => (
                <tr key={r.grade}>
                  <td>
                    <span className={`grade-badge grade-${(r.grade || 'C')[0]}`}>
                      {r.grade || 'N/A'}
                    </span>
                  </td>
                  <td><span className="badge">{r.count}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

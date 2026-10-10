import React from 'react';

export default function StatCard({ label, value, icon, color = 'blue' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className={`stat-icon stat-icon-${color}`}>
        {icon}
      </div>
    </div>
  );
}

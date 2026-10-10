import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--navy-900)' }}>
          <GraduationCap size={20} color="var(--primary-600)" />
          <span>Examify Online Examination Portal</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Examify. Java Full Stack Spring Boot & React Application.</p>
      </div>
    </footer>
  );
}

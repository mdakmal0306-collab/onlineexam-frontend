import React from 'react';
import { Layers, Database, Shield, Cpu, Award, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="container" style={{ marginTop: '1.5rem', maxWidth: '900px' }}>
      <div className="page-header" style={{ textAlign: 'center', display: 'block', marginBottom: '2.5rem' }}>
        <h1 className="page-title">About Examify System</h1>
        <p className="page-subtitle">
          An enterprise-grade Java Full Stack Online Examination Platform built with Spring Boot, MySQL, and React.js.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--primary-800)' }}>Project Architecture</h2>
        <p style={{ color: 'var(--navy-700)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Examify is built upon a standard multi-tiered architecture ensuring complete separation of concerns, high throughput, and airtight examination integrity.
        </p>

        <div className="grid-2">
          <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Layers size={18} color="var(--primary-600)" />
              <span>Frontend Tier</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              React 18 single-page application with modern hooks, client-side routing via React Router DOM, Axios/Fetch REST communication, and custom responsive vanilla design system.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Cpu size={18} color="var(--primary-600)" />
              <span>Backend Tier</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Spring Boot 3.x RESTful web services, Spring Security 6 with JWT token stateless authentication, Bean Validation, and centralized exception management.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Database size={18} color="var(--primary-600)" />
              <span>Persistence Tier</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Spring Data JPA / Hibernate with MySQL relational database, automated transaction management, unique constraints, and referential foreign keys.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Shield size={18} color="var(--primary-600)" />
              <span>Security & Integrity</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              BCrypt password encryption, server-side deadline evaluation, zero-exposure student question DTOs, and role-based endpoint isolation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

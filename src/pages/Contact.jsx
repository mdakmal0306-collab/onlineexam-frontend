import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Notification from '../components/Notification';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container" style={{ marginTop: '1.5rem', maxWidth: '1000px' }}>
      <div className="page-header" style={{ textAlign: 'center', display: 'block', marginBottom: '2.5rem' }}>
        <h1 className="page-title">Contact Support & Administration</h1>
        <p className="page-subtitle">Have technical questions regarding your examination or credentials? Reach out to us.</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Get in Touch</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="stat-icon stat-icon-blue"><Mail size={20} /></div>
              <div>
                <strong style={{ display: 'block', color: 'var(--navy-900)' }}>Email Support</strong>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>support@examify-portal.edu</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="stat-icon stat-icon-green"><Phone size={20} /></div>
              <div>
                <strong style={{ display: 'block', color: 'var(--navy-900)' }}>Academic Examination Hotline</strong>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>+1 (800) 555-EXAM</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="stat-icon stat-icon-amber"><MapPin size={20} /></div>
              <div>
                <strong style={{ display: 'block', color: 'var(--navy-900)' }}>Campus Office</strong>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Department of Computer Science & Engineering</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          {submitted && (
            <Notification 
              type="success" 
              message="Your inquiry has been submitted. Support will contact you shortly." 
              onClose={() => setSubmitted(false)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your name" 
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter your email" 
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Subject of your message" 
                required
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                rows="4" 
                className="form-textarea" 
                placeholder="Describe your issue or feedback..." 
                required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

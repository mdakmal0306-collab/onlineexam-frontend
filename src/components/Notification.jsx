import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Notification({ type = 'success', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`notification-banner notification-${type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
        <span>{message}</span>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

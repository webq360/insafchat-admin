import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

function SettingsContent() {
  const { admin } = useAuth();
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // In a real app, you'd save to backend or localStorage
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚙️ Settings</h1>
        <p style={styles.subtitle}>Configure your admin panel preferences</p>
      </div>

      {showSuccess && (
        <div style={styles.successBanner}>
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Account Settings */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>👤 Account Information</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            value={admin?.email || ''}
            disabled
            style={styles.input}
          />
          <p style={styles.helpText}>Your admin email address (read-only)</p>
        </div>
      </div>

      {/* API Configuration */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>🔗 API Configuration</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>API Base URL</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:5000/api"
            style={styles.input}
          />
          <p style={styles.helpText}>The base URL for your backend API</p>
        </div>
        <button onClick={handleSave} style={styles.saveBtn}>
          💾 Save Changes
        </button>
      </div>

      {/* System Information */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>ℹ️ System Information</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Version</span>
            <span style={styles.infoValue}>1.0.0</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Environment</span>
            <span style={styles.infoValue}>
              {process.env.NODE_ENV || 'development'}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Last Login</span>
            <span style={styles.infoValue}>{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={styles.dangerCard}>
        <h2 style={styles.dangerTitle}>⚠️ Danger Zone</h2>
        <p style={styles.dangerText}>
          These actions are permanent and cannot be undone.
        </p>
        <button style={styles.dangerBtn} onClick={() => {
          if (confirm('Are you sure you want to clear all cache?')) {
            localStorage.clear();
            alert('Cache cleared!');
          }
        }}>
          🗑️ Clear Cache
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  } as React.CSSProperties,

  header: {
    marginBottom: '32px',
  } as React.CSSProperties,

  title: {
    margin: '0 0 8px 0',
    fontSize: '36px',
    fontWeight: '800',
    color: '#1f2937',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as React.CSSProperties,

  subtitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500',
  } as React.CSSProperties,

  successBanner: {
    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    border: '2px solid #6ee7b7',
    color: '#065f46',
    padding: '16px 24px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontWeight: '600',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    animation: 'slideUp 0.3s ease-out',
  } as React.CSSProperties,

  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '24px',
    marginTop: 0,
  } as React.CSSProperties,

  formGroup: {
    marginBottom: '24px',
  } as React.CSSProperties,

  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s',
    background: 'white',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  helpText: {
    margin: '8px 0 0 0',
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  } as React.CSSProperties,

  saveBtn: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  } as React.CSSProperties,

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  } as React.CSSProperties,

  infoItem: {
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  infoLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  infoValue: {
    fontSize: '16px',
    color: '#1f2937',
    fontWeight: '600',
  } as React.CSSProperties,

  dangerCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    border: '2px solid #fca5a5',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
  } as React.CSSProperties,

  dangerTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: '12px',
    marginTop: 0,
  } as React.CSSProperties,

  dangerText: {
    margin: '0 0 20px 0',
    fontSize: '14px',
    color: '#7f1d1d',
    fontWeight: '500',
  } as React.CSSProperties,

  dangerBtn: {
    padding: '12px 24px',
    background: '#fee2e2',
    border: '2px solid #fca5a5',
    borderRadius: '10px',
    color: '#991b1b',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
};

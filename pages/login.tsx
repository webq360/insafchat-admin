import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

// SVG Icons
const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const PasswordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const LogInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@gmail.com');
    setPassword('adminadmin');
  };

  return (
    <div style={styles.container}>
      {/* Background Animation */}
      <div style={styles.bgGradient1}></div>
      <div style={styles.bgGradient2}></div>
      
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>InsafChat Admin</h1>
          <p style={styles.subtitle}>Manage your chat platform</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}><AlertIcon /></span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}><EmailIcon /></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}><LockIcon /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                disabled={loading}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.8 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              transform: loading ? 'scale(0.98)' : 'scale(1)',
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}>⏳</span> Logging in...
              </>
            ) : (
              <>
                <LogInIcon /> Login to Dashboard
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div style={styles.divider}></div>
        
        <div style={styles.demoSection}>
          <p style={styles.demoLabel}>Demo Credentials</p>
          <div style={styles.credentialBox}>
            <div style={styles.credentialItem}>
              <span style={styles.credentialIcon}><EmailIcon /></span>
              <span style={styles.credentialText}>admin@gmail.com</span>
            </div>
            <div style={styles.credentialItem}>
              <span style={styles.credentialIcon}><LockIcon /></span>
              <span style={styles.credentialText}>adminadmin</span>
            </div>
          </div>
          
          <button 
            onClick={handleDemoLogin} 
            style={styles.demoBtn} 
            disabled={loading}
          >
            <ZapIcon /> Use Demo Account
          </button>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          Secure admin dashboard for InsafChat platform
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative' as const,
    overflow: 'hidden',
  } as React.CSSProperties,
  bgGradient1: {
    position: 'absolute' as const,
    top: '-200px',
    right: '-200px',
    width: '500px',
    height: '500px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 6s ease-in-out infinite',
  } as React.CSSProperties,
  bgGradient2: {
    position: 'absolute' as const,
    bottom: '-200px',
    left: '-200px',
    width: '500px',
    height: '500px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 8s ease-in-out infinite reverse',
  } as React.CSSProperties,
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '48px 56px',
    maxWidth: '480px',
    width: '90%',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
    zIndex: 1,
    border: '1px solid rgba(255, 255, 255, 0.3)',
  } as React.CSSProperties,
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  } as React.CSSProperties,
  title: {
    margin: '0 0 12px 0',
    fontSize: '40px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-1px',
  } as React.CSSProperties,
  subtitle: {
    margin: 0,
    fontSize: '16px',
    color: '#666',
    fontWeight: '500',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  form: {
    marginBottom: '24px',
  } as React.CSSProperties,
  formGroup: {
    marginBottom: '18px',
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1f2937',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
  } as React.CSSProperties,
  inputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  inputIcon: {
    position: 'absolute' as const,
    left: '18px',
    fontSize: '20px',
    pointerEvents: 'none',
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    color: '#10B981',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '16px 16px 16px 56px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    background: '#f9fafb',
    fontWeight: '500',
  } as React.CSSProperties,
  eyeBtn: {
    position: 'absolute' as const,
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.2s',
    opacity: 0.6,
    color: '#10B981',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  submitBtn: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    letterSpacing: '0.5px',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
  } as React.CSSProperties,
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
    margin: '24px 0',
  } as React.CSSProperties,
  demoSection: {
    marginBottom: '16px',
    animation: 'slideUp 0.5s ease-out 0.2s both',
  } as React.CSSProperties,
  demoLabel: {
    margin: '0 0 14px 0',
    fontSize: '13px',
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  } as React.CSSProperties,
  credentialBox: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '2px solid #bbf7d0',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    backdropFilter: 'blur(10px)',
  } as React.CSSProperties,
  credentialItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#047857',
    margin: '8px 0',
    fontWeight: '600',
  } as React.CSSProperties,
  credentialIcon: {
    fontSize: '18px',
    minWidth: '24px',
    color: '#10B981',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  credentialText: {
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  demoBtn: {
    width: '100%',
    padding: '14px 24px',
    background: 'white',
    border: '2px solid #10B981',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#10B981',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  errorBox: {
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    border: '2px solid #fca5a5',
    color: '#991b1b',
    padding: '14px 16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600',
    animation: 'shake 0.5s ease-in-out',
  } as React.CSSProperties,
  errorIcon: {
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    color: '#991b1b',
  } as React.CSSProperties,
  footer: {
    margin: '16px 0 0 0',
    textAlign: 'center' as const,
    fontSize: '13px',
    color: '#999',
    fontWeight: '500',
    letterSpacing: '0.3px',
  } as React.CSSProperties,
};


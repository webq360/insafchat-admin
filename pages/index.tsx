import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface ApiStatus {
  status: string;
  service: string;
  version: string;
  environment: string;
}

function DashboardContent() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    activeUsers: 0,
    uptime: '99.9%'
  });

  useEffect(() => {
    const fetchApiStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/status`
        );
        setApiStatus(response.data);
      } catch (err: any) {
        console.error('API Status error:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to connect to API'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApiStatus();
    
    // Simulate fetching stats (replace with actual API call)
    setStats({
      totalUsers: 1234,
      totalMessages: 5678,
      activeUsers: 324,
      uptime: '98%'
    });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Dashboard Overview</h1>
          <p style={styles.subtitle}>Welcome to the InsafChat admin panel</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{stats.totalUsers.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💬</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{stats.totalMessages.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Messages</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🟢</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{stats.activeUsers}</div>
            <div style={styles.statLabel}>Active Users</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚡</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{stats.uptime}</div>
            <div style={styles.statLabel}>Uptime</div>
          </div>
        </div>
      </div>

      {/* API Status */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>🔗 API Status</h2>
        
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Checking API status...</p>
          </div>
        )}
        
        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorIcon}>⚠️</div>
            <div>
              <p style={styles.errorTitle}>Connection Error</p>
              <p style={styles.errorMessage}>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                style={styles.retryBtn}
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}
        
        {apiStatus && !loading && (
          <div style={styles.successBox}>
            <div style={styles.statusGrid}>
              <div style={styles.statusItem}>
                <span style={styles.statusLabel}>Service</span>
                <span style={styles.statusValue}>{apiStatus.service}</span>
              </div>
              <div style={styles.statusItem}>
                <span style={styles.statusLabel}>Version</span>
                <span style={styles.statusValue}>{apiStatus.version}</span>
              </div>
              <div style={styles.statusItem}>
                <span style={styles.statusLabel}>Environment</span>
                <span style={styles.statusValue}>{apiStatus.environment}</span>
              </div>
              <div style={styles.statusItem}>
                <span style={styles.statusLabel}>Status</span>
                <span style={styles.statusBadge}>✓ Running</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Info */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>ℹ️ System Information</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Platform</span>
            <span style={styles.infoValue}>InsafChat Admin Panel</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Version</span>
            <span style={styles.infoValue}>1.0.0</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Last Updated</span>
            <span style={styles.infoValue}>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
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

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  } as React.CSSProperties,

  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s',
  } as React.CSSProperties,

  statIcon: {
    fontSize: '40px',
    lineHeight: 1,
  } as React.CSSProperties,

  statContent: {
    flex: 1,
  } as React.CSSProperties,

  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#10B981',
    marginBottom: '4px',
    lineHeight: 1,
  } as React.CSSProperties,

  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
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
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '24px',
    marginTop: 0,
  } as React.CSSProperties,

  loadingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
    background: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,

  loadingText: {
    margin: 0,
    fontSize: '15px',
    color: '#6b7280',
    fontWeight: '500',
  } as React.CSSProperties,

  errorBox: {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    border: '2px solid #fca5a5',
    borderRadius: '12px',
  } as React.CSSProperties,

  errorIcon: {
    fontSize: '32px',
    lineHeight: 1,
  } as React.CSSProperties,

  errorTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '700',
    color: '#991b1b',
  } as React.CSSProperties,

  errorMessage: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#991b1b',
  } as React.CSSProperties,

  retryBtn: {
    padding: '10px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  } as React.CSSProperties,

  successBox: {
    padding: '24px',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '2px solid #bbf7d0',
    borderRadius: '12px',
  } as React.CSSProperties,

  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,

  statusItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  statusLabel: {
    fontSize: '12px',
    color: '#047857',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  statusValue: {
    fontSize: '18px',
    color: '#065f46',
    fontWeight: '700',
  } as React.CSSProperties,

  statusBadge: {
    fontSize: '16px',
    color: '#10B981',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  } as React.CSSProperties,

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
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
    fontSize: '13px',
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
};


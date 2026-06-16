import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

// SVG Icons
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.12-2.12l4.24-4.24"></path>
  </svg>
);

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5m7-5l5-5m0 0l-5-5m5 5H9"></path>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const UserCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();

  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/',
      active: router.pathname === '/',
    },
    {
      name: 'Users',
      icon: <UsersIcon />,
      href: '/users',
      active: router.pathname === '/users',
    },
    {
      name: 'Settings',
      icon: <SettingsIcon />,
      href: '/settings',
      active: router.pathname === '/settings',
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Don't show layout on login page
  if (router.pathname === '/login' || !isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}>
        {/* Sidebar Header */}
        <div style={styles.sidebarHeader}>
          <h1 style={styles.logo}>InsafChat</h1>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{...styles.closeBtn, display: 'flex'}}
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* Sidebar Menu */}
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                ...styles.navItem,
                background: item.active ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                color: item.active ? 'white' : '#666',
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={styles.sidebarFooter}>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            <LogOutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        ...styles.mainContent,
        marginLeft: (sidebarOpen && !isMobile) ? '280px' : '0',
      }}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={styles.menuBtn}
            >
              <MenuIcon />
            </button>
          </div>

          <div style={styles.topBarRight}>
            {/* Notifications */}
            <button style={styles.topBarButton}>
              <BellIcon />
              <span style={styles.notificationBadge}>3</span>
            </button>

            {/* User Menu */}
            <div style={styles.userMenu}>
              <UserCircleIcon />
              <span>{user?.email || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={styles.pageContent}>
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          style={{...styles.overlay, display: 'block'}}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    background: '#f5f5f5',
    position: 'relative' as const,
  } as React.CSSProperties,

  // Sidebar Styles
  sidebar: {
    width: '280px',
    background: 'white',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'fixed' as const,
    left: 0,
    top: 0,
    height: '100vh',
    zIndex: 1000,
    transition: 'transform 0.3s ease-in-out',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,

  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,

  logo: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as React.CSSProperties,

  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s',
  } as React.CSSProperties,

  nav: {
    flex: 1,
    padding: '20px 0',
    overflow: 'auto',
  } as React.CSSProperties,

  navItem: {
    width: '100%',
    padding: '16px 20px',
    border: 'none',
    background: 'transparent',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.3s',
    marginBottom: '8px',
    textAlign: 'left' as const,
  } as React.CSSProperties,

  navIcon: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #e0e0e0',
  } as React.CSSProperties,

  logoutBtn: {
    width: '100%',
    padding: '12px 16px',
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#991b1b',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s',
    fontSize: '15px',
  } as React.CSSProperties,

  // Main Content Styles
  mainContent: {
    flex: 1,
    marginLeft: '280px',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'margin-left 0.3s ease-in-out',
  } as React.CSSProperties,

  // Top Bar Styles
  topBar: {
    background: 'white',
    borderBottom: '1px solid #e0e0e0',
    padding: '16px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  } as React.CSSProperties,

  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#10B981',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s',
  } as React.CSSProperties,

  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  } as React.CSSProperties,

  topBarButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    padding: '8px',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s',
  } as React.CSSProperties,

  notificationBadge: {
    position: 'absolute' as const,
    top: '0',
    right: '0',
    background: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  } as React.CSSProperties,

  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    background: '#f5f5f5',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#666',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.3s',
  } as React.CSSProperties,

  // Page Content
  pageContent: {
    flex: 1,
    padding: '28px',
    overflow: 'auto',
  } as React.CSSProperties,

  // Overlay
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: 'none',
  } as React.CSSProperties,
};

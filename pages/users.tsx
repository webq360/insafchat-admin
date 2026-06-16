import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface User {
  _id: string;
  username?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  status: string;
  profilePicture?: string;
  bio?: string;
  isBanned?: boolean;
  bannedAt?: string;
  bannedReason?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Stats {
  total: number;
  online: number;
  offline: number;
}

// SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const BlockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="m4.93 4.93 14.14 14.14"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({ total: 0, online: 0, offline: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (user.username?.toLowerCase().includes(searchLower)) ||
        (user.fullName?.toLowerCase().includes(searchLower)) ||
        (user.email?.toLowerCase().includes(searchLower)) ||
        (user.phone?.includes(searchTerm)) ||
        (user.phoneNumber?.includes(searchTerm))
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/contacts`,
        { headers }
      );
      
      const userData = response.data.data || response.data || [];
      setUsers(userData);
      
      // Calculate stats
      const total = userData.length;
      const online = userData.filter((u: User) => u.status === 'online').length;
      const offline = total - online;
      setStats({ total, online, offline });
      
      setError(null);
    } catch (err: any) {
      console.error('❌ Failed to fetch users:', err);
      
      let errorMessage = 'Failed to fetch users';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        localStorage.removeItem('authToken');
        localStorage.removeItem('admin');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('authToken');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsers(users.filter(u => u._id !== userId));
      alert('✅ User deleted successfully');
    } catch (err: any) {
      alert('❌ Failed to delete user: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    const user = users.find(u => u._id === userId);
    const isBanned = user?.isBanned;
    
    if (!confirm(`Are you sure you want to ${isBanned ? 'unban' : 'ban'} this user?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('authToken');
      const endpoint = isBanned ? 'unban' : 'ban';
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/users/${userId}/${endpoint}`,
        { reason: 'Banned by admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`✅ User ${isBanned ? 'unbanned' : 'banned'} successfully`);
      fetchUsers();
    } catch (err: any) {
      alert(`❌ Failed to ${isBanned ? 'unban' : 'ban'} user: ` + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const getStatusBadge = (status: string, isBanned?: boolean) => {
    if (isBanned) {
      return (
        <span style={{
          ...styles.statusBadge,
          background: '#fee2e2',
          color: '#991b1b',
        }}>
          <span style={{
            ...styles.statusDot,
            background: '#ef4444',
          }} />
          banned
        </span>
      );
    }
    
    const isOnline = status === 'online';
    return (
      <span style={{
        ...styles.statusBadge,
        background: isOnline ? '#dcfce7' : '#f3f4f6',
        color: isOnline ? '#166534' : '#6b7280',
      }}>
        <span style={{
          ...styles.statusDot,
          background: isOnline ? '#10b981' : '#9ca3af',
        }} />
        {status}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header with Stats */}
      <div style={styles.headerSection}>
        <div style={styles.titleArea}>
          <h1 style={styles.title}>
            <UsersIcon />
            <span>User Management</span>
          </h1>
          <p style={styles.subtitle}>Manage and monitor all users</p>
        </div>
        
        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon} className="total">
              <UsersIcon />
            </div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Total Users</p>
              <p style={styles.statValue}>{stats.total}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon} className="online">
              <ActivityIcon />
            </div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Online</p>
              <p style={styles.statValue}>{stats.online}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon} className="offline">
              <ActivityIcon />
            </div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Offline</p>
              <p style={styles.statValue}>{stats.offline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <div style={styles.searchInputWrapper}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button onClick={fetchUsers} style={styles.refreshBtn} className="refreshBtn">
          <RefreshIcon />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>⚠️ {error}</p>
          <button onClick={fetchUsers} style={styles.retryBtn}>Try Again</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div style={styles.emptyContainer}>
          <UsersIcon />
          <p style={styles.emptyText}>
            {searchTerm ? 'No users found matching your search' : 'No users found'}
          </p>
        </div>
      )}

      {/* Users Grid */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div style={styles.usersGrid}>
          {filteredUsers.map((user) => (
            <div key={user._id} style={styles.userCard} className="userCard">
              <div style={styles.userCardHeader}>
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} style={styles.avatar} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {(user.fullName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div style={styles.userInfo}>
                  <h3 style={styles.userName}>{user.fullName}</h3>
                  {user.username && <p style={styles.username}>@{user.username}</p>}
                  {getStatusBadge(user.status, user.isBanned)}
                </div>
              </div>
              
              <div style={styles.userCardBody}>
                {user.email && (
                  <div style={styles.contactItem}>
                    <MailIcon />
                    <span>{user.email}</span>
                  </div>
                )}
                {(user.phone || user.phoneNumber) && (
                  <div style={styles.contactItem}>
                    <PhoneIcon />
                    <span>{user.phone || user.phoneNumber}</span>
                  </div>
                )}
              </div>

              <div style={styles.userCardFooter}>
                <button onClick={() => handleViewUser(user)} style={styles.actionBtn} className="view">
                  <EyeIcon />
                </button>
                <button 
                  onClick={() => handleBlockUser(user._id)} 
                  style={{...styles.actionBtn, background: user.isBanned ? '#fef3c7' : '#fee2e2', color: user.isBanned ? '#92400e' : '#991b1b'}} 
                  className={user.isBanned ? "unban" : "block"} 
                  disabled={actionLoading}
                  title={user.isBanned ? "Unban User" : "Ban User"}
                >
                  <BlockIcon />
                </button>
                <button onClick={() => handleDeleteUser(user._id)} style={styles.actionBtn} className="delete" disabled={actionLoading}>
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>User Details</h2>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
                <XIcon />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalUserSection}>
                {selectedUser.profilePicture ? (
                  <img src={selectedUser.profilePicture} alt={selectedUser.fullName} style={styles.modalAvatar} />
                ) : (
                  <div style={styles.modalAvatarPlaceholder}>
                    {(selectedUser.fullName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <h3 style={styles.modalUserName}>{selectedUser.fullName}</h3>
                {selectedUser.username && <p style={styles.modalUsername}>@{selectedUser.username}</p>}
                {getStatusBadge(selectedUser.status, selectedUser.isBanned)}
              </div>
              
              <div style={styles.modalDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Email</span>
                  <span style={styles.detailValue}>{selectedUser.email || 'Not provided'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Phone</span>
                  <span style={styles.detailValue}>{selectedUser.phone || selectedUser.phoneNumber || 'Not provided'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Bio</span>
                  <span style={styles.detailValue}>{selectedUser.bio || 'No bio'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>User ID</span>
                  <span style={{...styles.detailValue, fontFamily: 'monospace', fontSize: '12px'}}>{selectedUser._id}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Joined</span>
                  <span style={styles.detailValue}>{new Date(selectedUser.createdAt).toLocaleString()}</span>
                </div>
                {selectedUser.isBanned && (
                  <>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Banned At</span>
                      <span style={styles.detailValue}>{selectedUser.bannedAt ? new Date(selectedUser.bannedAt).toLocaleString() : 'N/A'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Ban Reason</span>
                      <span style={styles.detailValue}>{selectedUser.bannedReason || 'No reason provided'}</span>
                    </div>
                  </>
                )}
              </div>

              <div style={styles.modalActions}>
                <button onClick={() => { handleBlockUser(selectedUser._id); setShowModal(false); }} style={styles.modalBtn} className="block">
                  <BlockIcon />
                  <span>Block User</span>
                </button>
                <button onClick={() => { handleDeleteUser(selectedUser._id); setShowModal(false); }} style={styles.modalBtn} className="delete">
                  <TrashIcon />
                  <span>Delete User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Users() {
  return (
    <ProtectedRoute>
      <UsersContent />
    </ProtectedRoute>
  );
}

const styles = {
  container: { maxWidth: '1400px', margin: '0 auto', padding: '24px' } as React.CSSProperties,
  headerSection: { marginBottom: '32px' } as React.CSSProperties,
  titleArea: { marginBottom: '24px' } as React.CSSProperties,
  title: { fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#111827' } as React.CSSProperties,
  subtitle: { margin: 0, fontSize: '15px', color: '#6b7280' } as React.CSSProperties,
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' } as React.CSSProperties,
  statCard: { background: 'white', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' } as React.CSSProperties,
  statIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' } as React.CSSProperties,
  statContent: { flex: 1 } as React.CSSProperties,
  statLabel: { margin: '0 0 4px 0', fontSize: '13px', color: '#6b7280', fontWeight: '500' } as React.CSSProperties,
  statValue: { margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' } as React.CSSProperties,
  searchBar: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' as const } as React.CSSProperties,
  searchInputWrapper: { flex: 1, minWidth: '300px', position: 'relative' as const, display: 'flex', alignItems: 'center', background: 'white', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' } as React.CSSProperties,
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '15px', marginLeft: '12px', background: 'transparent' } as React.CSSProperties,
  refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(16,185,129,0.2)' } as React.CSSProperties,
  loadingContainer: { background: 'white', borderRadius: '12px', padding: '60px 20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } as React.CSSProperties,
  spinner: { width: '48px', height: '48px', border: '4px solid #f3f4f6', borderTop: '4px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' } as React.CSSProperties,
  loadingText: { margin: 0, fontSize: '15px', color: '#6b7280', fontWeight: '500' } as React.CSSProperties,
  errorContainer: { background: '#fef2f2', borderRadius: '12px', padding: '40px 20px', textAlign: 'center' as const, border: '1px solid #fecaca' } as React.CSSProperties,
  errorText: { margin: '0 0 16px 0', fontSize: '15px', color: '#991b1b', fontWeight: '500' } as React.CSSProperties,
  retryBtn: { padding: '10px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' } as React.CSSProperties,
  emptyContainer: { background: 'white', borderRadius: '12px', padding: '60px 20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '16px', color: '#9ca3af', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } as React.CSSProperties,
  emptyText: { margin: 0, fontSize: '15px', color: '#6b7280' } as React.CSSProperties,
  usersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' } as React.CSSProperties,
  userCard: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', transition: 'all 0.2s' } as React.CSSProperties,
  userCardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' } as React.CSSProperties,
  avatar: { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' as const, border: '2px solid #10b981' } as React.CSSProperties,
  avatarPlaceholder: { width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700' } as React.CSSProperties,
  userInfo: { flex: 1 } as React.CSSProperties,
  userName: { margin: '0 0 4px 0', fontSize: '17px', fontWeight: '600', color: '#111827' } as React.CSSProperties,
  username: { margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280' } as React.CSSProperties,
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' } as React.CSSProperties,
  statusDot: { width: '6px', height: '6px', borderRadius: '50%' } as React.CSSProperties,
  userCardBody: { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '16px' } as React.CSSProperties,
  contactItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' } as React.CSSProperties,
  userCardFooter: { display: 'flex', gap: '8px', justifyContent: 'flex-end' } as React.CSSProperties,
  actionBtn: { width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', background: '#f3f4f6', color: '#6b7280' } as React.CSSProperties,
  modalOverlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' } as React.CSSProperties,
  modal: { background: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' } as React.CSSProperties,
  modalHeader: { padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties,
  modalTitle: { margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827' } as React.CSSProperties,
  closeBtn: { width: '40px', height: '40px', borderRadius: '8px', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' } as React.CSSProperties,
  modalBody: { padding: '24px' } as React.CSSProperties,
  modalUserSection: { textAlign: 'center' as const, marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' } as React.CSSProperties,
  modalAvatar: { width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' as const, border: '3px solid #10b981', marginBottom: '16px' } as React.CSSProperties,
  modalAvatarPlaceholder: { width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '700', marginBottom: '16px' } as React.CSSProperties,
  modalUserName: { margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#111827' } as React.CSSProperties,
  modalUsername: { margin: '0 0 12px 0', fontSize: '15px', color: '#6b7280' } as React.CSSProperties,
  modalDetails: { display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '24px' } as React.CSSProperties,
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' } as React.CSSProperties,
  detailLabel: { fontSize: '13px', fontWeight: '600', color: '#6b7280' } as React.CSSProperties,
  detailValue: { fontSize: '14px', color: '#111827', textAlign: 'right' as const, maxWidth: '60%', wordBreak: 'break-word' as const } as React.CSSProperties,
  modalActions: { display: 'flex', gap: '12px' } as React.CSSProperties,
  modalBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' } as React.CSSProperties,
};

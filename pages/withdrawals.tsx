import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';

interface BankDetails {
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  routingNumber?: string;
}

interface Withdrawal {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    phone: string;
    email?: string;
    walletBalance?: number;
  };
  amount: number;
  bankDetails: BankDetails;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  adminNotes?: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  completed: number;
  rejected: number;
  totalAmount: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.104:5000/api/v1';

export default function Withdrawals() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchWithdrawals();
  }, [filter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const url = filter === 'all' 
        ? `${API_BASE_URL}/admin/withdrawals`
        : `${API_BASE_URL}/admin/withdrawals?status=${filter}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.withdrawals || [];
      setWithdrawals(data);

      // Calculate stats
      const newStats: Stats = {
        total: data.length,
        pending: data.filter((w: Withdrawal) => w.status === 'pending').length,
        approved: data.filter((w: Withdrawal) => w.status === 'approved').length,
        completed: data.filter((w: Withdrawal) => w.status === 'completed').length,
        rejected: data.filter((w: Withdrawal) => w.status === 'rejected').length,
        totalAmount: data.reduce((sum: number, w: Withdrawal) => sum + w.amount, 0),
      };
      setStats(newStats);
    } catch (error: any) {
      console.error('Fetch error:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (withdrawalId: string, action: 'approve' | 'reject') => {
    let rejectionReason = '';
    
    if (action === 'reject') {
      rejectionReason = prompt('Please enter rejection reason:');
      if (!rejectionReason || rejectionReason.trim() === '') {
        alert('Rejection reason is required');
        return;
      }
    }
    
    if (!confirm(`Are you sure you want to ${action} this withdrawal?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('authToken');

      const body = action === 'reject' ? { rejectionReason } : {};

      const response = await axios.put(
        `${API_BASE_URL}/admin/withdrawals/${withdrawalId}/${action}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Withdrawal ${action}ed successfully!`);
      setShowModal(false);
      fetchWithdrawals();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${action} withdrawal`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatAmount = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  return (
    <Layout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>💰 Withdrawal Management</h1>
            <p style={styles.subtitle}>Review and manage withdrawal requests</p>
          </div>
          <button onClick={fetchWithdrawals} style={styles.refreshBtn}>
            <span style={styles.refreshIcon}>↻</span>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, ...styles.statCardPurple}}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.total}</div>
              <div style={styles.statLabel}>Total Requests</div>
            </div>
          </div>
          <div style={{...styles.statCard, ...styles.statCardYellow}}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.pending}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
          </div>
          <div style={{...styles.statCard, ...styles.statCardGreen}}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.completed}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>
          <div style={{...styles.statCard, ...styles.statCardRed}}>
            <div style={styles.statIcon}>❌</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.rejected}</div>
              <div style={styles.statLabel}>Rejected</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterContainer}>
          {(['all', 'pending', 'approved', 'completed', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                ...styles.filterTab,
                ...(filter === status ? styles.filterTabActive : {}),
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span style={styles.filterBadge}>
                  {stats[status as keyof Stats]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading withdrawals...</p>
          </div>
        ) : withdrawals.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>No Withdrawals Found</h3>
            <p style={styles.emptyText}>
              {filter === 'all' 
                ? 'There are no withdrawal requests yet.'
                : `No ${filter} withdrawal requests found.`}
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Bank</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.userAvatar}>
                          {withdrawal.userId.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.userName}>{withdrawal.userId.fullName}</div>
                          <div style={styles.userPhone}>{withdrawal.userId.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.amountCell}>{formatAmount(withdrawal.amount)}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.bankCell}>
                        <div style={styles.bankName}>{withdrawal.bankDetails.bankName}</div>
                        <div style={styles.accountNumber}>
                          {withdrawal.bankDetails.accountNumber}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        ...(withdrawal.status === 'pending' ? styles.statusPending : {}),
                        ...(withdrawal.status === 'completed' ? styles.statusCompleted : {}),
                        ...(withdrawal.status === 'rejected' ? styles.statusRejected : {}),
                        ...(withdrawal.status === 'approved' ? styles.statusApproved : {}),
                      }}>
                        {withdrawal.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateCell}>{formatDate(withdrawal.createdAt)}</div>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setShowModal(true);
                        }}
                        style={styles.viewBtn}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedWithdrawal && (
          <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Withdrawal Details</h2>
                <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
                  ✕
                </button>
              </div>

              <div style={styles.modalContent}>
                {/* User Info Card */}
                <div style={styles.infoCard}>
                  <div style={styles.infoCardHeader}>
                    <span style={styles.infoCardIcon}>👤</span>
                    <h3 style={styles.infoCardTitle}>User Information</h3>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Full Name</span>
                    <span style={styles.infoValue}>{selectedWithdrawal.userId.fullName}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Phone Number</span>
                    <span style={styles.infoValue}>{selectedWithdrawal.userId.phone}</span>
                  </div>
                  {selectedWithdrawal.userId.email && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Email</span>
                      <span style={styles.infoValue}>{selectedWithdrawal.userId.email}</span>
                    </div>
                  )}
                  {selectedWithdrawal.userId.walletBalance !== undefined && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Wallet Balance</span>
                      <span style={{...styles.infoValue, color: '#10B981', fontWeight: '700'}}>
                        {formatAmount(selectedWithdrawal.userId.walletBalance)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Amount Card */}
                <div style={{...styles.infoCard, background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '2px solid #bbf7d0'}}>
                  <div style={styles.infoCardHeader}>
                    <span style={styles.infoCardIcon}>💰</span>
                    <h3 style={styles.infoCardTitle}>Withdrawal Amount</h3>
                  </div>
                  <div style={styles.amountDisplay}>
                    {formatAmount(selectedWithdrawal.amount)}
                  </div>
                </div>

                {/* Bank Details Card */}
                <div style={styles.infoCard}>
                  <div style={styles.infoCardHeader}>
                    <span style={styles.infoCardIcon}>🏦</span>
                    <h3 style={styles.infoCardTitle}>Bank Details</h3>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Bank Name</span>
                    <span style={styles.infoValue}>{selectedWithdrawal.bankDetails.bankName}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Account Holder</span>
                    <span style={styles.infoValue}>{selectedWithdrawal.bankDetails.accountHolderName}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Account Number</span>
                    <span style={{...styles.infoValue, fontFamily: 'monospace', fontWeight: '700'}}>
                      {selectedWithdrawal.bankDetails.accountNumber}
                    </span>
                  </div>
                  {selectedWithdrawal.bankDetails.routingNumber && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Routing Number</span>
                      <span style={{...styles.infoValue, fontFamily: 'monospace'}}>
                        {selectedWithdrawal.bankDetails.routingNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status & Timeline Card */}
                <div style={styles.infoCard}>
                  <div style={styles.infoCardHeader}>
                    <span style={styles.infoCardIcon}>📅</span>
                    <h3 style={styles.infoCardTitle}>Status & Timeline</h3>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Status</span>
                    <span style={{
                      ...styles.statusBadge,
                      ...(selectedWithdrawal.status === 'pending' ? styles.statusPending : {}),
                      ...(selectedWithdrawal.status === 'completed' ? styles.statusCompleted : {}),
                      ...(selectedWithdrawal.status === 'rejected' ? styles.statusRejected : {}),
                      ...(selectedWithdrawal.status === 'approved' ? styles.statusApproved : {}),
                    }}>
                      {selectedWithdrawal.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Requested On</span>
                    <span style={styles.infoValue}>
                      {new Date(selectedWithdrawal.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Last Updated</span>
                    <span style={styles.infoValue}>
                      {new Date(selectedWithdrawal.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  {selectedWithdrawal.rejectionReason && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Rejection Reason</span>
                      <span style={{...styles.infoValue, color: '#EF4444'}}>
                        {selectedWithdrawal.rejectionReason}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedWithdrawal.status === 'pending' && (
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => handleAction(selectedWithdrawal._id, 'approve')}
                      disabled={actionLoading}
                      style={styles.approveBtn}
                    >
                      {actionLoading ? 'Processing...' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => handleAction(selectedWithdrawal._id, 'reject')}
                      disabled={actionLoading}
                      style={styles.rejectBtn}
                    >
                      {actionLoading ? 'Processing...' : '✕ Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  } as React.CSSProperties,

  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: '800',
    color: '#1f2937',
  } as React.CSSProperties,

  subtitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: '15px',
  } as React.CSSProperties,

  refreshBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  } as React.CSSProperties,

  refreshIcon: {
    fontSize: '18px',
    display: 'inline-block',
  } as React.CSSProperties,

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  } as React.CSSProperties,

  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '2px solid transparent',
    transition: 'all 0.3s',
  } as React.CSSProperties,

  statCardPurple: {
    borderColor: '#e9d5ff',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
  } as React.CSSProperties,

  statCardYellow: {
    borderColor: '#fde68a',
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
  } as React.CSSProperties,

  statCardGreen: {
    borderColor: '#bbf7d0',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
  } as React.CSSProperties,

  statCardRed: {
    borderColor: '#fecaca',
    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
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
    color: '#1f2937',
    marginBottom: '4px',
    lineHeight: 1,
  } as React.CSSProperties,

  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  filterContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    background: 'white',
    padding: '8px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  } as React.CSSProperties,

  filterTab: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  filterTabActive: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  } as React.CSSProperties,

  filterBadge: {
    background: 'rgba(255,255,255,0.3)',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
  } as React.CSSProperties,

  loadingContainer: {
    textAlign: 'center' as const,
    padding: '80px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  } as React.CSSProperties,

  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  } as React.CSSProperties,

  loadingText: {
    margin: 0,
    fontSize: '15px',
    color: '#6b7280',
    fontWeight: '500',
  } as React.CSSProperties,

  emptyState: {
    textAlign: 'center' as const,
    padding: '80px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  } as React.CSSProperties,

  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  } as React.CSSProperties,

  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px',
  } as React.CSSProperties,

  emptyText: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,

  tableContainer: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  } as React.CSSProperties,

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,

  tableHead: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    borderBottom: '2px solid #e5e7eb',
  } as React.CSSProperties,

  th: {
    padding: '16px 20px',
    textAlign: 'left' as const,
    fontSize: '12px',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  tr: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  td: {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#1f2937',
  } as React.CSSProperties,

  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,

  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
  } as React.CSSProperties,

  userName: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '2px',
  } as React.CSSProperties,

  userPhone: {
    fontSize: '13px',
    color: '#6b7280',
  } as React.CSSProperties,

  amountCell: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#10B981',
  } as React.CSSProperties,

  bankCell: {
  } as React.CSSProperties,

  bankName: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '2px',
  } as React.CSSProperties,

  accountNumber: {
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: 'monospace',
  } as React.CSSProperties,

  dateCell: {
    fontSize: '13px',
    color: '#6b7280',
  } as React.CSSProperties,

  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    display: 'inline-block',
  } as React.CSSProperties,

  statusPending: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    color: '#92400e',
  } as React.CSSProperties,

  statusCompleted: {
    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    color: '#065f46',
  } as React.CSSProperties,

  statusRejected: {
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    color: '#991b1b',
  } as React.CSSProperties,

  statusApproved: {
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    color: '#1e40af',
  } as React.CSSProperties,

  viewBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  } as React.CSSProperties,

  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  } as React.CSSProperties,

  modal: {
    background: 'white',
    borderRadius: '20px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 16px',
    borderBottom: '2px solid #f3f4f6',
  } as React.CSSProperties,

  modalTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
  } as React.CSSProperties,

  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px 8px',
    lineHeight: 1,
    transition: 'all 0.3s',
  } as React.CSSProperties,

  modalContent: {
    padding: '24px',
  } as React.CSSProperties,

  infoCard: {
    background: '#f9fafb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    border: '2px solid #e5e7eb',
  } as React.CSSProperties,

  infoCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  } as React.CSSProperties,

  infoCardIcon: {
    fontSize: '20px',
  } as React.CSSProperties,

  infoCardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#1f2937',
  } as React.CSSProperties,

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb',
  } as React.CSSProperties,

  infoLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '600',
  } as React.CSSProperties,

  infoValue: {
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'right' as const,
  } as React.CSSProperties,

  amountDisplay: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#10B981',
    textAlign: 'center' as const,
    padding: '16px 0',
  } as React.CSSProperties,

  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  } as React.CSSProperties,

  approveBtn: {
    flex: 1,
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  } as React.CSSProperties,

  rejectBtn: {
    flex: 1,
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  } as React.CSSProperties,
};

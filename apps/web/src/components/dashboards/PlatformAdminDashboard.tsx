import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Card, CardTitle, Badge, Button, Input } from '../ui';
import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';

interface PlatformAdminDashboardProps {
  user: any;
}

interface SchoolItem {
  _id: string;
  name: string;
  slug: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  email: string;
  phone: string;
  address: string;
  emailVerified: boolean;
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  settings?: {
    affiliation?: string;
    affiliationNumber?: string;
  };
  admin?: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    status: string;
  } | null;
  counts: {
    users: number;
    students: number;
    teachers: number;
  };
}

interface PlatformStats {
  schools: {
    total: number;
    pending: number;
    active: number;
    suspended: number;
    rejected: number;
  };
  users: {
    total: number;
    active: number;
    pending: number;
    admins: number;
    teachers: number;
    students: number;
    guardians: number;
  };
}

export default function PlatformAdminDashboard({ user }: PlatformAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'schools' | 'admins' | 'activity'>('schools');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Action modals
  const [rejectModalSchool, setRejectModalSchool] = useState<SchoolItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchPlatformData = async () => {
    try {
      setError('');
      const [statsRes, schoolsRes, usersRes, activityRes] = await Promise.all([
        api.get('/platform/stats'),
        api.get('/platform/schools', {
          params: { status: statusFilter, search: searchQuery || undefined, limit: 50 },
        }),
        api.get('/platform/users', {
          params: { role: 'admin', limit: 50 },
        }),
        api.get('/platform/recent-activity'),
      ]);

      setStats(statsRes.data?.data || null);
      setSchools(schoolsRes.data?.data?.items || []);
      setAdmins(usersRes.data?.data?.items || []);
      setActivities(activityRes.data?.data || []);
    } catch (err: any) {
      console.error('Failed to fetch platform admin data:', err);
      setError(err.response?.data?.error || 'Failed to load platform data. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPlatformData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlatformData();
  };

  const handleApproveSchool = async (school: SchoolItem) => {
    if (!window.confirm(`Approve "${school.name}" and activate its primary administrator account?`)) {
      return;
    }

    setActionInProgress(school._id);
    setActionSuccess('');
    setError('');

    try {
      await api.post(`/platform/schools/${school._id}/approve`);
      setActionSuccess(`✅ "${school.name}" and administrator account have been successfully verified and activated!`);
      await fetchPlatformData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve school');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectSchool = async () => {
    if (!rejectModalSchool) return;
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setActionInProgress(rejectModalSchool._id);
    setActionSuccess('');
    setError('');

    try {
      await api.post(`/platform/schools/${rejectModalSchool._id}/reject`, {
        reason: rejectionReason.trim(),
      });
      setActionSuccess(`School "${rejectModalSchool.name}" was rejected.`);
      setRejectModalSchool(null);
      setRejectionReason('');
      await fetchPlatformData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject school');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleSuspendSchool = async (school: SchoolItem) => {
    const reason = window.prompt(`Enter reason for suspending "${school.name}":`, 'Administrative review');
    if (!reason) return;

    setActionInProgress(school._id);
    try {
      await api.post(`/platform/schools/${school._id}/suspend`, { reason });
      setActionSuccess(`School "${school.name}" has been suspended.`);
      await fetchPlatformData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to suspend school');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReactivateSchool = async (school: SchoolItem) => {
    if (!window.confirm(`Reactivate school "${school.name}"?`)) return;

    setActionInProgress(school._id);
    try {
      await api.post(`/platform/schools/${school._id}/reactivate`);
      setActionSuccess(`School "${school.name}" has been reactivated.`);
      await fetchPlatformData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reactivate school');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteSchool = async (school: SchoolItem) => {
    if (!window.confirm(`⚠️ PERMANENT ACTION: Are you sure you want to delete "${school.name}" and all associated data?`)) {
      return;
    }

    setActionInProgress(school._id);
    try {
      await api.delete(`/platform/schools/${school._id}`);
      setActionSuccess(`School "${school.name}" was permanently removed.`);
      await fetchPlatformData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete school');
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Verification</Badge>;
      case 'suspended':
        return <Badge variant="danger">Suspended</Badge>;
      case 'rejected':
        return <Badge variant="default">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Platform Header ─── */}
      <Card padding="default" className="border-primary-500/20 bg-gradient-to-r from-primary-500/5 via-background to-background">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/10 text-primary-600 dark:text-primary-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Platform Super-Admin Command
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-headline text-foreground tracking-tight">
              AcadFlows Platform Administration
            </h1>
            <p className="mt-1 text-sm text-muted">
              Verify genuine educational institutions, review administrator credentials, and manage tenant health.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted">Signed in as Founder</p>
              <p className="text-xs font-bold text-foreground font-mono">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon="🔄"
              disabled={refreshing}
              onClick={() => {
                setRefreshing(true);
                fetchPlatformData();
              }}
            >
              {refreshing ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ─── Feedback Alerts ─── */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium animate-fade-down flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button
            type="button"
            onClick={() => setActionSuccess('')}
            className="text-xs text-green-700 hover:underline dark:text-green-400 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium animate-fade-down flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-xs text-red-700 hover:underline dark:text-red-400 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── Key Metrics Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Schools</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {stats?.schools?.total ?? '—'}
              </p>
              <p className="text-xs text-muted mt-1">
                <span className="text-emerald-600 font-semibold">{stats?.schools?.active ?? 0} active</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-2xl">
              🏫
            </div>
          </div>
        </Card>

        <Card className={cn(
          stats?.schools?.pending && stats.schools.pending > 0
            ? 'border-amber-500/50 bg-amber-500/5 ring-2 ring-amber-500/20'
            : ''
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Needs Verification
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {stats?.schools?.pending ?? 0}
              </p>
              <p className="text-xs text-muted mt-1">Awaiting approval</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-2xl">
              ⏳
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">School Admins</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {stats?.users?.admins ?? '—'}
              </p>
              <p className="text-xs text-muted mt-1">Verified principals & staff</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
              👨‍💼
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Platform Users</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {stats?.users?.total ?? '—'}
              </p>
              <p className="text-xs text-muted mt-1">Across all schools</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </Card>
      </div>

      {/* ─── Tab Controls ─── */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('schools')}
          className={cn(
            'px-4 py-2 text-sm font-bold rounded-lg transition-all shrink-0 flex items-center gap-2',
            activeTab === 'schools'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-muted hover:text-foreground hover:bg-elevated'
          )}
        >
          <span>🏫 School Verifications</span>
          {stats?.schools?.pending ? (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-black',
              activeTab === 'schools' ? 'bg-white text-primary-600' : 'bg-amber-500 text-white'
            )}>
              {stats.schools.pending}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={cn(
            'px-4 py-2 text-sm font-bold rounded-lg transition-all shrink-0 flex items-center gap-2',
            activeTab === 'admins'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-muted hover:text-foreground hover:bg-elevated'
          )}
        >
          <span>👥 School Administrators</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-elevated text-muted">
            {admins.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={cn(
            'px-4 py-2 text-sm font-bold rounded-lg transition-all shrink-0 flex items-center gap-2',
            activeTab === 'activity'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-muted hover:text-foreground hover:bg-elevated'
          )}
        >
          <span>📋 Audit & Activity Log</span>
        </button>
      </div>

      {/* ─── Tab 1: School Verifications & Directory ─── */}
      {activeTab === 'schools' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <Card padding="sm">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['all', 'pending', 'active', 'suspended', 'rejected'] as const).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors',
                      statusFilter === status
                        ? 'bg-foreground text-background'
                        : 'bg-elevated text-muted hover:text-foreground hover:bg-surface-tint'
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-80">
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by school, city, admin..."
                  className="text-xs"
                />
                <Button type="submit" size="sm" variant="outline">
                  Search
                </Button>
              </form>
            </div>
          </Card>

          {/* School Applications List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-border border-t-primary-500" />
              <p className="text-xs text-muted mt-3">Loading school records...</p>
            </div>
          ) : schools.length === 0 ? (
            <Card className="text-center py-16">
              <p className="text-4xl mb-3">🏫</p>
              <h3 className="text-base font-bold text-foreground">No schools found</h3>
              <p className="text-xs text-muted mt-1">
                {statusFilter === 'pending'
                  ? 'All school applications have been reviewed! Great job.'
                  : 'No schools match the selected status or search filter.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {schools.map(school => (
                <Card
                  key={school._id}
                  padding="default"
                  className={cn(
                    'transition-all duration-200 border',
                    school.status === 'pending'
                      ? 'border-amber-500/40 bg-amber-500/[0.02] shadow-sm'
                      : 'border-border'
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: School Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-lg font-bold text-foreground tracking-tight">
                          {school.name}
                        </h3>
                        {getStatusBadge(school.status)}
                        {school.settings?.affiliation && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-500/10 text-primary-600 dark:text-primary-400">
                            {school.settings.affiliation}
                            {school.settings.affiliationNumber ? ` · ${school.settings.affiliationNumber}` : ''}
                          </span>
                        )}
                        <span className="text-xs font-mono text-muted bg-elevated px-2 py-0.5 rounded">
                          slug: /{school.slug}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted pt-1">
                        <div>
                          <span className="font-semibold text-foreground">Official Email:</span>{' '}
                          <a href={`mailto:${school.email}`} className="text-primary-600 hover:underline">
                            {school.email || 'N/A'}
                          </a>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Phone:</span>{' '}
                          {school.phone || 'N/A'}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Registered:</span>{' '}
                          {formatDate(school.createdAt)}
                        </div>
                        {school.address && (
                          <div className="sm:col-span-2 md:col-span-3">
                            <span className="font-semibold text-foreground">Campus Address:</span>{' '}
                            {school.address}
                          </div>
                        )}
                      </div>

                      {/* Primary School Administrator Box */}
                      {school.admin && (
                        <div className="mt-3 p-3 rounded-xl bg-elevated/60 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">
                                👨‍💼 Primary Administrator: {school.admin.name}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                                {school.admin.designation || 'Administrator'}
                              </span>
                            </div>
                            <p className="text-xs text-muted mt-0.5">
                              Login Email: <strong className="text-foreground">{school.admin.email}</strong>
                              {school.admin.phone ? ` · Phone: ${school.admin.phone}` : ''}
                            </p>
                          </div>
                          <div>
                            <span className={cn(
                              'text-xs font-bold px-2 py-1 rounded-full',
                              school.admin.status === 'active'
                                ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            )}>
                              Admin {school.admin.status}
                            </span>
                          </div>
                        </div>
                      )}

                      {school.rejectionReason && (
                        <div className="p-2.5 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 text-xs">
                          <strong>Rejection reason:</strong> {school.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                      {school.status === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={actionInProgress === school._id}
                            onClick={() => handleApproveSchool(school)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold"
                          >
                            ✓ Verify & Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionInProgress === school._id}
                            onClick={() => {
                              setRejectModalSchool(school);
                              setRejectionReason('');
                            }}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            ✕ Reject
                          </Button>
                        </>
                      )}

                      {school.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionInProgress === school._id}
                          onClick={() => handleSuspendSchool(school)}
                          className="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs"
                        >
                          Suspend School
                        </Button>
                      )}

                      {(school.status === 'suspended' || school.status === 'rejected') && (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={actionInProgress === school._id}
                          onClick={() => handleReactivateSchool(school)}
                          className="text-xs"
                        >
                          Reactivate
                        </Button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteSchool(school)}
                        disabled={actionInProgress === school._id}
                        className="text-xs text-muted hover:text-red-600 transition-colors p-1"
                        title="Delete school completely"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Tab 2: School Administrators ─── */}
      {activeTab === 'admins' && (
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-bold text-foreground">Registered School Administrators</h3>
            <p className="text-xs text-muted mt-0.5">
              Direct overview of all school principals and administrative officers across institutions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-elevated border-b border-border">
                <tr>
                  {['Administrator', 'Email', 'School / Institution', 'Status', 'Joined'].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted',
                        i === 3 && 'text-center'
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-muted">
                      No school administrators found.
                    </td>
                  </tr>
                ) : (
                  admins.map(admin => (
                    <tr key={admin._id} className="hover:bg-elevated/40 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">
                        {admin.name || `${admin.firstName} ${admin.lastName}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-mono whitespace-nowrap">
                        {admin.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                        {admin.tenantName || '—'}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {getStatusBadge(admin.status)}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {formatDate(admin.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ─── Tab 3: Recent Platform Activity ─── */}
      {activeTab === 'activity' && (
        <Card>
          <CardTitle className="mb-4">📋 Platform System Audit Log</CardTitle>
          {activities.length === 0 ? (
            <p className="text-sm text-muted py-6 text-center">No platform activity recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {activities.map(act => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border bg-elevated/30"
                >
                  <span className="text-2xl">{act.icon || '📌'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{act.message}</p>
                    <p className="text-xs text-muted mt-0.5">{formatDate(act.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ─── Rejection Reason Modal ─── */}
      {rejectModalSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full rounded-2xl bg-surface border border-border p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">Reject School Application</h3>
            <p className="text-xs text-muted mt-1">
              Provide a clear reason for rejecting <strong>{rejectModalSchool.name}</strong>. This feedback will be emailed to the school.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g., Unable to verify CBSE affiliation number with board directory. Please re-submit valid affiliation documentation."
              className="mt-4 w-full rounded-xl border border-border bg-elevated p-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModalSchool(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleRejectSchool}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


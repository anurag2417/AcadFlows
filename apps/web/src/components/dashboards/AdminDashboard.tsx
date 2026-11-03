import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardTitle } from '../ui';
import { cn } from '../../lib/cn';

interface AdminDashboardProps {
  data: any;
  tenant: any;
  user: any;
}

interface Activity {
  id: string;
  icon: string;
  message: string;
  timestamp: string;
  type: string;
}

export default function AdminDashboard({
  data,
  tenant,
  user,
}: AdminDashboardProps) {
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/recent-activity');
      setRecentActivities(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Stats from API ──
  const stats = [
    {
      label: 'Total Students',
      value: data?.stats?.totalStudents ?? 0,
      icon: '👨‍🎓',
      color: 'blue',
      change: '0%',
    },
    {
      label: 'Total Teachers',
      value: data?.stats?.totalTeachers ?? 0,
      icon: '👨‍🏫',
      color: 'green',
      change: '0%',
    },
    {
      label: 'Attendance Today',
      value: data?.stats?.attendance ?? '0%',
      icon: '📊',
      color: 'purple',
      change: '0%',
    },
  ];

  const quickActions: any[] = data?.quickActions ?? [];

  const bubbleColors: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    teal: 'bg-teal-50 dark:bg-teal-900/20',
  };

  return (
    <div className="space-y-6">
      {/* ─── Welcome + Notifications ─── */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.firstName || 'Admin'}! 👋
            </h2>
            <p className="mt-1 text-muted">
              Here's what's happening at {tenant?.name || 'your school'}
            </p>
          </div>
        </div>
      </Card>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
                    bubbleColors[stat.color] || bubbleColors.blue,
                  )}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-muted">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted">{stat.change}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── Two Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <Card>
              <CardTitle className="mb-4">Quick Actions</CardTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((action: any) => (
                  <Link
                    key={action.label}
                    to={action.path}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border transition-all hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-500/50 dark:hover:bg-primary-900/10"
                  >
                    <span className="text-2xl mb-1">{action.icon}</span>
                    <span className="text-sm font-medium text-center text-foreground">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardTitle className="mb-4">Recent Activity</CardTitle>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                </div>
              ) : recentActivities.length === 0 ? (
                <p className="text-sm text-center py-4 text-muted">
                  No recent activity
                </p>
              ) : (
                recentActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardTitle className="mb-4">📅 Schedule</CardTitle>
            <p className="text-sm text-center py-4 text-muted">
              View school timetable and upcoming classes
            </p>
            <Link
              to="/timetable"
              className="block text-center mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View Timetable →
            </Link>
          </Card>

        </div>
      </div>
    </div>
  );
}
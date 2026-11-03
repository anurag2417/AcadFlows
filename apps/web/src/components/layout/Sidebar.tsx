import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/cn';
import Logo from '../ui/Logo';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: string;
  path: string;
  roles: ('admin' | 'teacher' | 'student' | 'guardian')[];
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: '📊',
        path: '/dashboard',
        roles: ['admin', 'teacher', 'student', 'guardian'],
      },
    ],
  },
  {
    label: 'Academics',
    items: [
      { label: 'Academic Years', icon: '🗓️', path: '/academic/years', roles: ['admin'] },
      { label: 'Grades', icon: '🎓', path: '/academic/grades', roles: ['admin'] },
      { label: 'Classes & Sections', icon: '🏫', path: '/academic/sections', roles: ['admin'] },
      { label: 'Subjects', icon: '📚', path: '/academic/subjects', roles: ['admin'] },
      { label: 'Teacher Assignments', icon: '👥', path: '/academic/assignments', roles: ['admin'] },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Students', icon: '👨‍🎓', path: '/students', roles: ['admin'] },
      { label: 'Teachers', icon: '👨‍🏫', path: '/teachers', roles: ['admin'] },
    ],
  },
  {
    label: 'My Class',
    items: [
      { label: 'My Class', icon: '🏫', path: '/teacher/class-roster', roles: ['teacher'] },
    ],
  },
  {
    label: 'Attendance',
    items: [
      { label: 'Mark Attendance', icon: '✅', path: '/attendance/mark', roles: ['admin', 'teacher'] },
      { label: 'Reports', icon: '📈', path: '/attendance/reports', roles: ['admin', 'teacher'] },
    ],
  },
  {
    label: 'Grading',
    items: [
      { label: 'Assignments', icon: '📝', path: '/assignments', roles: ['teacher', 'student'] },
      { label: 'Gradebook', icon: '📖', path: '/gradebook', roles: ['student'] },
      { label: 'Report Cards', icon: '🎯', path: '/report-cards', roles: ['admin', 'teacher'] },
      { label: 'Timetable', icon: '📅', path: '/timetable', roles: ['admin', 'teacher', 'student', 'guardian'] },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', icon: '👤', path: '/profile', roles: ['admin', 'teacher', 'student', 'guardian'] },
      { label: 'Settings', icon: '⚙️', path: '/settings', roles: ['admin'] },
    ],
  },
];

const platformNavGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Platform Administration',
    items: [
      {
        label: 'Platform Hub',
        icon: '🛡️',
        path: '/dashboard',
        roles: ['admin', 'teacher', 'student', 'guardian'],
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Profile',
        icon: '👤',
        path: '/profile',
        roles: ['admin', 'teacher', 'student', 'guardian'],
      },
    ],
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.role || 'student';
  const isPlatformAdmin = user?.isPlatformAdmin === true || user?.email === 'acadflows00@gmail.com';
  const activeNavGroups = isPlatformAdmin ? platformNavGroups : navGroups;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 md:top-16 bottom-0 z-50 md:z-40 w-72 max-w-[85vw] md:w-64',
          'bg-surface border-r border-border',
          'transition-transform duration-300 ease-out',
          'overflow-y-auto overscroll-contain flex flex-col',
          'md:translate-x-0',
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0',
        )}
        aria-label="Main navigation"
      >
        {/* Mobile-only header inside drawer */}
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <Logo to="/dashboard" size="xs" showText={true} />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-elevated transition-colors"
            aria-label="Close navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-3 space-y-5 flex-1">
          {activeNavGroups.map(group => {
            const visibleItems = group.items.filter(item =>
              item.roles.includes(role),
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map(item => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 768) onClose();
                      }}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                          'transition-colors duration-200',
                          'group',
                          isActive
                            ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400 font-semibold'
                            : 'text-muted hover:text-foreground hover:bg-elevated',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={cn(
                              'text-base flex-shrink-0 transition-transform duration-200',
                              isActive && 'scale-110',
                            )}
                            aria-hidden
                          >
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                          {isActive && (
                            <span className="ml-auto w-1.5 h-4 rounded-full bg-primary-500" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border mt-auto bg-surface">
          <div className="px-3 py-2 rounded-lg bg-elevated/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {isPlatformAdmin ? 'Platform Access' : 'Signed in as'}
            </p>
            <p className="text-xs text-foreground font-semibold truncate mt-0.5">
              {user?.firstName} {user?.lastName}
            </p>
            <p className={cn(
              "text-[10px] capitalize font-medium",
              isPlatformAdmin ? "text-primary-600 dark:text-primary-400 font-bold" : "text-muted"
            )}>
              {isPlatformAdmin ? 'Founder / Super-Admin' : role}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full mt-2.5 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
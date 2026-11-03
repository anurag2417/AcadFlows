import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import SchoolRegistrationPage from './pages/SchoolRegistration';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';

import AcademicYearsPage from './pages/admin/academic/AcademicYears';
import GradesPage from './pages/admin/academic/Grades';
import SectionsPage from './pages/admin/academic/Sections';
import SubjectsPage from './pages/admin/academic/Subjects';
import TeacherAssignmentsPage from './pages/admin/academic/TeacherAssignments';
import StudentsPage from './pages/admin/Students';
import AddStudentPage from './pages/admin/AddStudent';
import StudentDetailPage from './pages/admin/StudentDetail';
import BulkImportPage from './pages/admin/BulkImport';
import TeachersPage from './pages/admin/Teachers';
import AddTeacherPage from './pages/admin/AddTeacher';
import TeacherDetailPage from './pages/admin/TeacherDetail';
import MarkAttendancePage from './pages/admin/MarkAttendance';
import AttendanceReportsPage from './pages/admin/AttendanceReports';
import AssignmentsPage from './pages/admin/Assignments';
import CreateAssignmentPage from './pages/admin/CreateAssignment';
import AssignmentSubmissionsPage from './pages/admin/AssignmentSubmissions';
import GradebookPage from './pages/student/Gradebook';
import ReportCardsPage from './pages/admin/ReportCards';
import TimetablesPage from './pages/admin/Timetables';
import CreateTimetablePage from './pages/admin/CreateTimetable';
import TimetableViewPage from './pages/TimetableView';
import SettingsPage from './pages/admin/Settings';
import ClassRosterPage from './pages/teacher/ClassRoster';

function Protected({
  children,
  requiredRole,
  allowedRoles,
}: {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'teacher' | 'student' | 'guardian';
  allowedRoles?: ('admin' | 'teacher' | 'student' | 'guardian')[];
}) {
  return (
    <ProtectedRoute requiredRole={requiredRole} allowedRoles={allowedRoles}>
      {children}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/school/register" element={<SchoolRegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/:tenantSlug/login" element={<LoginPage />} />
            <Route path="/:tenantSlug/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/:tenantSlug/reset-password" element={<ResetPasswordPage />} />

            <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
            <Route path="/:tenantSlug/dashboard" element={<Protected><DashboardPage /></Protected>} />
            <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />

            <Route path="/academic/years" element={<Protected requiredRole="admin"><AcademicYearsPage /></Protected>} />
            <Route path="/academic/grades" element={<Protected requiredRole="admin"><GradesPage /></Protected>} />
            <Route path="/academic/sections" element={<Protected requiredRole="admin"><SectionsPage /></Protected>} />
            <Route path="/academic/subjects" element={<Protected requiredRole="admin"><SubjectsPage /></Protected>} />
            <Route path="/academic/assignments" element={<Protected requiredRole="admin"><TeacherAssignmentsPage /></Protected>} />

            <Route path="/students" element={<Protected requiredRole="admin"><StudentsPage /></Protected>} />
            <Route path="/students/add" element={<Protected requiredRole="admin"><AddStudentPage /></Protected>} />
            <Route path="/students/:id" element={<Protected requiredRole="admin"><StudentDetailPage /></Protected>} />
            <Route path="/students/:id/edit" element={<Protected requiredRole="admin"><AddStudentPage /></Protected>} />
            <Route path="/students/import" element={<Protected requiredRole="admin"><BulkImportPage /></Protected>} />

            <Route path="/teachers" element={<Protected requiredRole="admin"><TeachersPage /></Protected>} />
            <Route path="/teachers/add" element={<Protected requiredRole="admin"><AddTeacherPage /></Protected>} />
            <Route path="/teachers/:id" element={<Protected requiredRole="admin"><TeacherDetailPage /></Protected>} />
            <Route path="/teachers/:id/edit" element={<Protected requiredRole="admin"><AddTeacherPage /></Protected>} />

            <Route path="/attendance/mark" element={<Protected allowedRoles={['admin', 'teacher']}><MarkAttendancePage /></Protected>} />
            <Route path="/attendance/reports" element={<Protected allowedRoles={['admin', 'teacher']}><AttendanceReportsPage /></Protected>} />

            <Route path="/teacher/class-roster" element={<Protected requiredRole="teacher"><ClassRosterPage /></Protected>} />

            <Route path="/assignments" element={<Protected allowedRoles={['teacher', 'student']}><AssignmentsPage /></Protected>} />
            <Route path="/assignments/create" element={<Protected requiredRole="teacher"><CreateAssignmentPage /></Protected>} />
            <Route path="/assignments/:id/edit" element={<Protected requiredRole="teacher"><CreateAssignmentPage /></Protected>} />
            <Route path="/assignments/:id/submissions" element={<Protected requiredRole="teacher"><AssignmentSubmissionsPage /></Protected>} />
            <Route path="/assignments/:id" element={<Protected allowedRoles={['teacher', 'student']}><AssignmentSubmissionsPage /></Protected>} />
            <Route path="/gradebook" element={<Protected requiredRole="student"><GradebookPage /></Protected>} />
            <Route path="/report-cards" element={<Protected allowedRoles={['admin', 'teacher']}><ReportCardsPage /></Protected>} />

            <Route path="/timetable" element={<Protected><TimetablesPage /></Protected>} />
            <Route path="/timetable/create" element={<Protected requiredRole="admin"><CreateTimetablePage /></Protected>} />
            <Route path="/timetable/:id" element={<Protected><TimetableViewPage /></Protected>} />
            <Route path="/timetable/:id/edit" element={<Protected requiredRole="admin"><CreateTimetablePage /></Protected>} />
            <Route path="/settings" element={<Protected requiredRole="admin"><SettingsPage /></Protected>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

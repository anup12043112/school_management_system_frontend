import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import RoleRoute from './routes/RoleRoute';

import ProtectedRoutes from './routes/ProtectedRoutes';
import LandingPage from './pages/LandingPage';

import AdminDashboard from "./pages/admin/Dashboard"
import AdminMarks from "./pages/admin/Marks"
import AdminNotice from "./pages/admin/Notice"
import AdminSections from "./pages/admin/Sections"
import AdminSubjects from "./pages/admin/Subjects"
import AdminUsers from "./pages/admin/Users"

import ParentDashboard from "./pages/parent/Dashboard"
import ParentAttendance from "./pages/parent/Attendance"
import ParentMarks from "./pages/parent/Marks"
import ParentNotice from "./pages/parent/Notice"
import ParentProfile from "./pages/parent/Profile"
import MyChildren from "./pages/parent/MyChildren"

import StudentDashboard from "./pages/student/Dashboard"
import StudentAttendance from "./pages/student/Attendance"
import StudentMarks from "./pages/student/Marks"
import StudentNotice from "./pages/student/Notice"
import StudentProfile from "./pages/student/Profile"
import StudentMyClasses from "./pages/student/MyClasses"

import TeacherDashboard from "./pages/teacher/Dashboard"
import TeacherAttendance from "./pages/teacher/Attendance"
import TeacherMarks from "./pages/teacher/Marks"
import TeacherNotice from "./pages/teacher/Notice"
import TeacherProfile from "./pages/teacher/Profile"
import TeacherMyClasses from "./pages/teacher/MyClasses"

import AppLayout from './pages/AppLayout';

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>

            <Route path="/" element={<LandingPage />} />
            <Route element={<ProtectedRoutes />}>
              <Route element={<AppLayout />}>

                {/* ADMIN ROUTES*/}
                <Route element={<RoleRoute allowedRole="admin" />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/marks" element={<AdminMarks />} />
                  <Route path="/admin/notice" element={<AdminNotice />} />
                  <Route path="/admin/sections" element={<AdminSections />} />
                  <Route path="/admin/attendance" element={<AdminSubjects />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                </Route>


                {/* PARENT ROUTES  */}
                <Route element={<RoleRoute allowedRole="parent" />}>
                  <Route path="/parent/dashboard" element={<ParentDashboard />} />
                  <Route path="/parent/attendance" element={<ParentAttendance />} />
                  <Route path="/parent/marks" element={<ParentMarks />} />
                  <Route path="/parent/notice" element={<ParentNotice />} />
                  <Route path="/parent/profile" element={<ParentProfile />} />
                  <Route path="/parent/my-children" element={<MyChildren />} />
                </Route>


                {/* STUDENT ROUTES  */}
                <Route element={<RoleRoute allowedRole="student" />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/attendance" element={<StudentAttendance />} />
                  <Route path="/student/marks" element={<StudentMarks />} />
                  <Route path="/student/notice" element={<StudentNotice />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                  <Route path="/student/my-classes" element={<StudentMyClasses />} />
                </Route>


                {/* TEACHER ROUTES  */}
                <Route element={<RoleRoute allowedRole="teacher" />}>
                  <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                  <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                  <Route path="/teacher/marks" element={<TeacherMarks />} />
                  <Route path="/teacher/notice" element={<TeacherNotice />} />
                  <Route path="/teacher/profile" element={<TeacherProfile />} />
                  <Route path="/teacher/my-classes" element={<TeacherMyClasses />} />
                </Route>

              </Route>
            </Route>

          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

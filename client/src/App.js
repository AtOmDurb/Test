import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import AdminPanel from './components/Dashboard/AdminPanel';
import TeacherPanel from './components/Dashboard/TeacherPanel';
import StudentPanel from './components/Dashboard/StudentPanel';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/teacher" element={
              <ProtectedRoute role="teacher">
                <TeacherPanel />
              </ProtectedRoute>
            } />
            <Route path="/student" element={
              <ProtectedRoute role="student">
                <StudentPanel />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
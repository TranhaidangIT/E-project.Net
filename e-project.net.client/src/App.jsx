import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import SongManagement from './pages/SongManagement';
import MusicPage from './pages/MusicPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }
    
    return user ? children : <Navigate to="/login" />;
}

// Admin Route Component
function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return user.isAdmin ? children : <Navigate to="/" />;
}

// Public Route (redirect if logged in)
function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }
    
    return user ? <Navigate to="/profile" /> : children;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/login" element={
                <PublicRoute><LoginPage /></PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute><RegisterPage /></PublicRoute>
            } />
            <Route path="/forgot-password" element={
                <PublicRoute><ForgotPasswordPage /></PublicRoute>
            } />
            <Route path="/reset-password" element={
                <PublicRoute><ResetPasswordPage /></PublicRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/songs" element={
                <AdminRoute><SongManagement /></AdminRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

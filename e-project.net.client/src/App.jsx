import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
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
            <Route path="/login" element={
                <PublicRoute><LoginPage /></PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute><RegisterPage /></PublicRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
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

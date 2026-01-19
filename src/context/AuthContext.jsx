import { useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await userAPI.getProfile();
            setUser(response.data);
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
        }
        return response.data;
    };

    const register = async (userData) => {
        const response = await authAPI.register(userData);
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
        }
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth hook moved to src/hooks/useAuth.js

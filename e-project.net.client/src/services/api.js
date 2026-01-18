import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    validateResetToken: (data) => api.post('/auth/validate-reset-token', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    changePassword: (data) => api.put('/user/change-password', data),
    deleteAccount: () => api.delete('/user/delete'),
};

// Admin API
export const adminAPI = {
    getAllUsers: () => api.get('/admin/users'),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    toggleAdmin: (id, isAdmin) => api.put(`/admin/users/${id}/role`, { isAdmin }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Song API
export const songAPI = {
    getAllSongs: () => api.get('/song'),
    getSongById: (id) => api.get(`/song/${id}`),
    createSong: (data) => api.post('/song', data),
    updateSong: (id, data) => api.put(`/song/${id}`, data),
    deleteSong: (id) => api.delete(`/song/${id}`),
    searchSongs: (query) => api.get(`/song/search?query=${encodeURIComponent(query)}`),
};

export default api;

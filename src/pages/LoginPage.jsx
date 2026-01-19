import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData);
            if (result.success) {
                navigate('/profile');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
        <div className="auth-container">
            <button onClick={() => navigate(-1)} className="btn-back-auth">← Quay Lại</button>
            <div className="auth-card">
                <h2>🎵 Music Web - Đăng Nhập</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Nhập username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>
                
                <div className="auth-links">
                    <Link to="/forgot-password" className="forgot-password-link">
                        Quên mật khẩu?
                    </Link>
                </div>
                
                <p className="auth-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
        </Layout>
    );
}

export default LoginPage;

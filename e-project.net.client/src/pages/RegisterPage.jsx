import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData);
            if (result.success) {
                navigate('/profile');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
        <div className="auth-container">
            <div className="auth-card">
                <h2>🎵 Music Web - Đăng Ký</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên đăng nhập *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            minLength={3}
                            placeholder="Tối thiểu 3 ký tự"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@email.com"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Mật khẩu *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            placeholder="Tối thiểu 6 ký tự"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Xác nhận mật khẩu *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>
                
                <p className="auth-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
        </Layout>
    );
}

export default RegisterPage;

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        token: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setFormData(prev => ({ ...prev, token }));
            validateToken(token);
        } else {
            setError('Không tìm thấy mã khôi phục. Vui lòng thử lại.');
            setValidating(false);
        }
    }, [searchParams]);

    const validateToken = async (token) => {
        try {
            const response = await authAPI.validateResetToken({ token });
            if (response.data.success) {
                setTokenValid(true);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Mã khôi phục không hợp lệ hoặc đã hết hạn.');
        } finally {
            setValidating(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.resetPassword({
                token: formData.token,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });
            
            if (response.data.success) {
                alert('✅ Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
                navigate('/login');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="loading">Đang xác thực mã khôi phục...</div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>❌ Mã Không Hợp Lệ</h2>
                    <div className="error-message">{error}</div>
                    <div className="auth-links">
                        <Link to="/forgot-password" className="btn-primary">Gửi lại mã khôi phục</Link>
                        <Link to="/login" className="auth-link">Quay lại đăng nhập</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>🔑 Đặt Lại Mật Khẩu</h2>
                <p className="auth-description">
                    Nhập mật khẩu mới của bạn
                </p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Mã khôi phục</label>
                        <input
                            type="text"
                            name="token"
                            value={formData.token}
                            disabled
                            className="disabled-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                            minLength={6}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Nhập lại mật khẩu mới"
                            minLength={6}
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
                    </button>
                </form>
                
                <div className="auth-links">
                    <Link to="/login" className="auth-link">← Quay lại đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;

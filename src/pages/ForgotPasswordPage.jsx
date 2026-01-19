import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSuccess(false);

        try {
            const response = await authAPI.forgotPassword({ email });
            
            if (response.data.success) {
                setResetToken(response.data.token);
                setSuccess(true);
                // Tự động chuyển sang trang reset password sau 2 giây
                setTimeout(() => {
                    navigate(`/reset-password?token=${response.data.token}`);
                }, 2000);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>🔐 Quên Mật Khẩu</h2>
                <p className="auth-description">
                    Nhập email đã đăng ký để nhận mã khôi phục mật khẩu
                </p>
                
                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="success-message">
                        <p>✅ Mã khôi phục đã được tạo!</p>
                        <p className="token-display">Mã của bạn: <strong>{resetToken}</strong></p>
                        <p className="token-note">Đang chuyển hướng...</p>
                    </div>
                )}
                
                {!success && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Nhập email của bạn"
                                disabled={loading}
                            />
                        </div>
                        
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Đang xử lý...' : 'Gửi Mã Khôi Phục'}
                        </button>
                    </form>
                )}
                
                <div className="auth-links">
                    <Link to="/login" className="auth-link">← Quay lại đăng nhập</Link>
                    <Link to="/register" className="auth-link">Đăng ký tài khoản mới</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;

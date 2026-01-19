import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import Layout from '../components/Layout';

function ChangePasswordPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu mới không khớp');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('Mật khẩu mới phải khác mật khẩu cũ');
            return;
        }

        setLoading(true);

        try {
            await userAPI.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });
            
            setSuccess('Đổi mật khẩu thành công!');
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
        <div className="auth-container">
            <div className="auth-card">
                <h2>Đổi Mật Khẩu</h2>
                
                {success && <div className="success-message">{success}</div>}
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Mật khẩu hiện tại *</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Mật khẩu mới *</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            placeholder="Tối thiểu 6 ký tự"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Xác nhận mật khẩu mới *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                    </button>
                </form>
            </div>
        </div>
        </Layout>
    );
}

export default ChangePasswordPage;

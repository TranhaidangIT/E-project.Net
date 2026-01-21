import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import Layout from '../components/Layout';

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
            <Layout>
                <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                    <div className="text-primary font-bold text-xl animate-pulse">Đang xác thực mã khôi phục...</div>
                </div>
            </Layout>
        );
    }

    if (!tokenValid) {
        return (
            <Layout>
                <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Mã Không Hợp Lệ</h2>
                        <div className="bg-red-500/10 text-red-200 p-4 rounded-xl mb-6">{error}</div>
                        <div className="space-y-3">
                            <Link to="/forgot-password" className="block w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all">
                                Gửi lại mã khôi phục
                            </Link>
                            <Link to="/login" className="block text-text-secondary hover:text-white transition-colors text-sm">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Đặt Lại Mật Khẩu</h2>
                        <p className="text-text-secondary">
                            Nhập mật khẩu mới của bạn
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Mã khôi phục</label>
                            <input
                                type="text"
                                name="token"
                                value={formData.token}
                                disabled
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-text-muted cursor-not-allowed font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Nhập lại mật khẩu mới"
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-bold py-3 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-text-secondary hover:text-white transition-colors text-sm">
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ResetPasswordPage;

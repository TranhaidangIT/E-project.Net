import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Layout from '../components/Layout';

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
        <Layout>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Quên Mật Khẩu</h2>
                        <p className="text-text-secondary">
                            Nhập email đã đăng ký để nhận mã khôi phục mật khẩu
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-6 bg-green-500/10 border border-green-500/50 rounded-xl text-center">
                            <p className="text-green-400 font-bold mb-2">✅ Mã khôi phục đã được tạo!</p>
                            <p className="text-3xl font-mono text-white tracking-widest my-4 bg-black/20 py-2 rounded-lg">{resetToken}</p>
                            <p className="text-sm text-green-300 animate-pulse">Đang chuyển hướng...</p>
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Nhập email của bạn"
                                    disabled={loading}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-bold py-3 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xử lý...' : 'Gửi Mã Khôi Phục'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 flex items-center justify-between text-sm">
                        <Link to="/login" className="text-text-secondary hover:text-white transition-colors">
                            ← Quay lại đăng nhập
                        </Link>
                        <Link to="/register" className="text-primary font-bold hover:underline">
                            Đăng ký mới
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ForgotPasswordPage;

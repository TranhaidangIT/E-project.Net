import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
    const { user } = useAuth();

    return (
        <div className="auth-container">
            <div className="auth-card home-card">
                <h1>🎵 Music Web</h1>
                <p className="subtitle">Ứng dụng nghe nhạc trực tuyến</p>
                
                <div className="home-content">
                    {user ? (
                        <>
                            <p>Xin chào, <strong>{user.fullName || user.username}</strong>! 👋</p>
                            <div className="button-group">
                                <Link to="/music" className="btn-primary">
                                    🎵 Khám Phá Nhạc
                                </Link>
                                <Link to="/profile" className="btn-secondary">
                                    👤 Xem Profile
                                </Link>
                                {user.isAdmin && (
                                    <Link to="/admin" className="btn-secondary">
                                        ⚙️ Quản Trị
                                    </Link>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <p>Khám phá và thưởng thức âm nhạc tuyệt vời!</p>
                            <div className="button-group">
                                <Link to="/music" className="btn-primary">
                                    🎵 Khám Phá Nhạc
                                </Link>
                                <Link to="/login" className="btn-secondary">
                                    🔐 Đăng Nhập
                                </Link>
                                <Link to="/register" className="btn-secondary">
                                    📝 Đăng Ký
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="features">
                    <h3>✨ Tính năng</h3>
                    <ul>
                        <li>🎧 Nghe nhạc trực tuyến</li>
                        <li>📋 Tạo playlist yêu thích</li>
                        <li>❤️ Lưu bài hát yêu thích</li>
                        <li>📊 Lịch sử nghe nhạc</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

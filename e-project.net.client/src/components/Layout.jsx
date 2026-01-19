import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Layout.css';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="layout">
            {/* Header / Navbar */}
            <header className="main-header">
                <div className="header-container">
                    <div className="header-left">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🎵</span>
                            <span className="logo-text">Music Web</span>
                        </Link>
                        
                        {/* Navigation */}
                        <nav className="main-nav">
                            <Link to="/" className={`nav-link ${isActive('/')}`}>
                                🏠 Trang Chủ
                            </Link>
                            <Link to="/music" className={`nav-link ${isActive('/music')}`}>
                                🎧 Âm Nhạc
                            </Link>
                            {user && (
                                <Link to="/playlists" className={`nav-link ${isActive('/playlists')}`}>
                                    📋 Playlist
                                </Link>
                            )}
                        </nav>
                    </div>

                    <div className="header-right">
                        {user ? (
                            <div className="user-menu">
                                <div className="user-avatar" onClick={() => navigate('/profile')}>
                                    {user.avatarURL ? (
                                        <img src={user.avatarURL} alt={user.username} />
                                    ) : (
                                        <span>{user.username.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="user-dropdown">
                                    <span className="user-name">{user.username}</span>
                                    <div className="dropdown-menu">
                                        <Link to="/profile" className="dropdown-item">
                                            👤 Hồ Sơ
                                        </Link>
                                        {user.isAdmin && (
                                            <Link to="/admin" className="dropdown-item">
                                                ⚙️ Quản Trị
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="dropdown-item logout-btn">
                                            🚪 Đăng Xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn-header btn-login">
                                    Đăng Nhập
                                </Link>
                                <Link to="/register" className="btn-header btn-register">
                                    Đăng Ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Footer */}
            <footer className="main-footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>🎵 Music Web</h3>
                        <p>Nền tảng nghe nhạc yêu thích của bạn</p>
                    </div>
                    <div className="footer-section">
                        <h4>Liên Kết</h4>
                        <Link to="/">Trang Chủ</Link>
                        <Link to="/music">Âm Nhạc</Link>
                        {user && <Link to="/playlists">Playlist</Link>}
                    </div>
                    <div className="footer-section">
                        <h4>Tài Khoản</h4>
                        {user ? (
                            <>
                                <Link to="/profile">Hồ Sơ</Link>
                                <button onClick={handleLogout}>Đăng Xuất</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Đăng Nhập</Link>
                                <Link to="/register">Đăng Ký</Link>
                            </>
                        )}
                    </div>
                    <div className="footer-section">
                        <h4>Theo Dõi</h4>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Twitter">🐦</a>
                            <a href="#" aria-label="Instagram">📷</a>
                            <a href="#" aria-label="YouTube">📺</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Music Web. Bản quyền thuộc về chúng tôi.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

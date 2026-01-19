import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Layout.css';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    // Dynamic search placeholder based on current page
    const getSearchPlaceholder = () => {
        switch (location.pathname) {
            case '/playlists':
                return 'Tìm playlist của bạn...';
            case '/admin':
            case '/admin/songs':
                return 'Tìm kiếm người dùng...';
            case '/profile':
                return 'Tìm kiếm bài hát, nghệ sĩ...';
            default:
                return 'Tìm kiếm bài hát, nghệ sĩ...';
        }
    };

    // Dynamic search navigation based on current page
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        if (location.pathname === '/playlists') {
            // Stay on playlist page with search query
            navigate('/playlists?q=' + encodeURIComponent(searchQuery));
        } else {
            // Default: navigate to music page
            navigate('/music?q=' + encodeURIComponent(searchQuery));
        }
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
                                Trang Chủ
                            </Link>
                            <Link to="/music" className={`nav-link ${isActive('/music')}`}>
                                Âm Nhạc
                            </Link>
                            {user && (
                                <Link to="/playlists" className={`nav-link ${isActive('/playlists')}`}>
                                    Playlist
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* Search Bar - Center */}
                    <div className="header-center">
                        <form className="header-search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder={getSearchPlaceholder()}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </button>
                        </form>
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

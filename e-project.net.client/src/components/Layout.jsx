import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { songAPI, notificationAPI } from '../services/api';
import './Layout.css';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);
    const notificationRef = useRef(null);

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

    // Fetch suggestions with debounce
    const fetchSuggestions = async (query) => {
        if (!query || query.length < 1) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await songAPI.getSuggestions(query);
            console.log('Suggestions response:', response.data);
            setSuggestions(response.data || []);
            setShowSuggestions(true);
        } catch (err) {
            console.error('Failed to fetch suggestions:', err);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input change with debounce
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowSuggestions(true);

        // Debounce API calls
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        const query = suggestion.text;
        setSearchQuery(query);
        setSuggestions([]);
        setShowSuggestions(false);
        // Use setTimeout to ensure state updates before navigation
        setTimeout(() => {
            navigate('/music?q=' + encodeURIComponent(query));
        }, 0);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications when user is logged in
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const [notifRes, countRes] = await Promise.all([
                notificationAPI.getNotifications(10),
                notificationAPI.getUnreadCount()
            ]);
            setNotifications(notifRes.data);
            setUnreadCount(countRes.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            setNotifications(notifications.map(n => 
                n.notificationID === notificationId ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.notificationID);
        }
        if (notification.link) {
            navigate(notification.link);
        }
        setShowNotifications(false);
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diff = Math.floor((now - date) / 1000);
        
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#e74c3c">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                );
            case 'share':
                return (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#3498db">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                    </svg>
                );
            case 'system':
                return (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#1DB954">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#b3b3b3">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                    </svg>
                );
        }
    };

    // Clear search state when navigating to different pages (except music page with query)
    useEffect(() => {
        if (!location.pathname.startsWith('/music')) {
            // Only clear if not on music page
        }
        setShowSuggestions(false);
    }, [location.pathname]);

    // Highlight matching text in suggestions
    const highlightMatch = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) => 
            regex.test(part) ? <strong key={i}>{part}</strong> : part
        );
    };

    // Dynamic search navigation based on current page
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setShowSuggestions(false);
        if (location.pathname === '/playlists') {
            navigate('/playlists?q=' + encodeURIComponent(searchQuery));
        } else {
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
                            <img src="/logo.svg" alt="Logo" className="logo-icon" />
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
                    <div className="header-center" ref={searchRef}>
                        <form className="header-search" onSubmit={handleSearch}>
                            <button type="submit" className="search-btn">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </button>
                            <input
                                type="text"
                                placeholder={getSearchPlaceholder()}
                                value={searchQuery}
                                onChange={handleInputChange}
                                onFocus={() => searchQuery && setShowSuggestions(true)}
                            />
                            {searchQuery && (
                                <button 
                                    type="button" 
                                    className="clear-btn"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSuggestions([]);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </form>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && (suggestions.length > 0 || isLoading) && (
                            <div className="search-suggestions">
                                {isLoading ? (
                                    <div className="suggestion-loading">Đang tìm...</div>
                                ) : (
                                    suggestions.map((suggestion, index) => (
                                        <div 
                                            key={`${suggestion.id}-${index}`}
                                            className="suggestion-item"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSuggestionClick(suggestion);
                                            }}
                                        >
                                            <div className="suggestion-icon">
                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                                </svg>
                                            </div>
                                            <div className="suggestion-text">
                                                <span className="suggestion-main">
                                                    {highlightMatch(suggestion.text, searchQuery)}
                                                </span>
                                                <span className="suggestion-sub">{suggestion.subText}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="header-right">
                        {user ? (
                            <>
                                {/* Notification Bell */}
                                <div className="notification-container" ref={notificationRef}>
                                    <button 
                                        className="notification-btn"
                                        onClick={() => setShowNotifications(!showNotifications)}
                                    >
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                        )}
                                    </button>

                                    {/* Notification Dropdown */}
                                    {showNotifications && (
                                        <div className="notification-dropdown">
                                            <div className="notification-header">
                                                <h3>Thông Báo</h3>
                                                {unreadCount > 0 && (
                                                    <button onClick={handleMarkAllAsRead} className="mark-all-read">
                                                        Đánh dấu tất cả đã đọc
                                                    </button>
                                                )}
                                            </div>
                                            <div className="notification-list">
                                                {notifications.length === 0 ? (
                                                    <div className="notification-empty">
                                                        <svg viewBox="0 0 24 24" width="48" height="48" fill="#b3b3b3">
                                                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                                                        </svg>
                                                        <p>Không có thông báo mới</p>
                                                    </div>
                                                ) : (
                                                    notifications.map(notification => (
                                                        <div 
                                                            key={notification.notificationID}
                                                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                                            onClick={() => handleNotificationClick(notification)}
                                                        >
                                                            <div className="notification-icon">
                                                                {notification.fromAvatarURL ? (
                                                                    <img src={notification.fromAvatarURL} alt="" />
                                                                ) : (
                                                                    getNotificationIcon(notification.type)
                                                                )}
                                                            </div>
                                                            <div className="notification-content">
                                                                <p className="notification-message">{notification.message}</p>
                                                                <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
                                                            </div>
                                                            {!notification.isRead && <div className="unread-dot"></div>}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

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
                                                Hồ Sơ
                                            </Link>
                                            <Link to="/liked-songs" className="dropdown-item">
                                                Nhạc Đã Thích
                                            </Link>
                                            {user.isAdmin && (
                                                <Link to="/admin" className="dropdown-item">
                                                    Quản Trị
                                                </Link>
                                            )}
                                            <button onClick={handleLogout} className="dropdown-item logout-btn">
                                                Đăng Xuất
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
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
                        <h3><img src="/logo.svg" alt="" className="footer-logo-icon" /> Music Web</h3>
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
                            <a href="#" aria-label="Facebook">FB</a>
                            <a href="#" aria-label="Twitter">TW</a>
                            <a href="#" aria-label="Instagram">IG</a>
                            <a href="#" aria-label="YouTube">YT</a>
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

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'text-primary' : 'text-text-secondary hover:text-white';
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-start to-background-end">
            {/* Header / Navbar */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background-start/80 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🎵</span>
                            <span className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Music Web</span>
                        </Link>
                        
                        {/* Navigation Desktop */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/')}`}>
                                Trang Chủ
                            </Link>
                            <Link to="/music" className={`text-sm font-medium transition-colors ${isActive('/music')}`}>
                                Âm Nhạc
                            </Link>
                            <Link to="/youtube" className={`text-sm font-medium transition-colors ${isActive('/youtube')}`}>
                                YouTube
                            </Link>
                            {user && (
                                <Link to="/playlists" className={`text-sm font-medium transition-colors ${isActive('/playlists')}`}>
                                    Playlist
                                </Link>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {user ? (
                            <div className="flex items-center gap-4 relative group">
                                <div className="hidden md:block text-right">
                                    <div className="text-sm font-bold text-white">{user.username}</div>
                                    <div className="text-xs text-text-secondary">Member</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] cursor-pointer hover:shadow-glow transition-shadow" onClick={() => navigate('/profile')}>
                                    <div className="w-full h-full rounded-full bg-background-start flex items-center justify-center overflow-hidden">
                                        {user.avatarURL ? (
                                            <img src={user.avatarURL} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Dropdown Menu */}
                                <div className="absolute top-full right-0 mt-2 w-48 bg-surface backdrop-blur-xl border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                    <div className="py-1">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 mx-1 rounded-lg">
                                            👤 Hồ Sơ
                                        </Link>
                                        {user.isAdmin && (
                                            <Link to="/admin" className="block px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 mx-1 rounded-lg">
                                                ⚙️ Quản Trị
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 mx-1 rounded-lg">
                                            🚪 Đăng Xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="px-5 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-full transition-colors">
                                    Đăng Nhập
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Đăng Ký
                                </Link>
                            </div>
                        )}
                        
                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
                            ☰
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-background-start border-t border-white/10 py-4 px-4 space-y-4 shadow-xl">
                        <Link to="/" className="block text-text-secondary hover:text-white" onClick={() => setMenuOpen(false)}>Trang Chủ</Link>
                        <Link to="/music" className="block text-text-secondary hover:text-white" onClick={() => setMenuOpen(false)}>Âm Nhạc</Link>
                        <Link to="/youtube" className="block text-text-secondary hover:text-white" onClick={() => setMenuOpen(false)}>YouTube</Link>
                        {user && <Link to="/playlists" className="block text-text-secondary hover:text-white" onClick={() => setMenuOpen(false)}>Playlist</Link>}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow pt-20 px-4 pb-12 w-full max-w-7xl mx-auto">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-1">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span>🎵</span> Music Web
                            </h3>
                            <p className="text-text-muted text-sm">
                                Nền tảng nghe nhạc trực tuyến với trải nghiệm đỉnh cao.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-white mb-4">Liên Kết</h4>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li><Link to="/" className="hover:text-primary transition-colors">Trang Chủ</Link></li>
                                <li><Link to="/music" className="hover:text-primary transition-colors">Âm Nhạc</Link></li>
                                {user && <li><Link to="/playlists" className="hover:text-primary transition-colors">Playlist</Link></li>}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-white mb-4">Hỗ Trợ</h4>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li><a href="#" className="hover:text-primary transition-colors">Trung Tâm Hỗ Trợ</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Điều Khoản</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Chính Sách</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-white mb-4">Kết Nối</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all">FB</a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all">IG</a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all">YT</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/5 mt-12 pt-8 text-center text-text-muted text-sm">
                        &copy; 2026 Music Web. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

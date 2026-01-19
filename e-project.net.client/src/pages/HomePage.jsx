import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import './HomePage.css';

function HomePage() {
    const { user } = useAuth();

    return (
        <Layout>
            {/* Hero Banner */}
            <section className="hero-banner">
                <div className="hero-wrapper">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Khám Phá <span className="highlight">Âm Nhạc</span> Của Bạn
                        </h1>
                        <p className="hero-subtitle">
                            Nghe hàng triệu bài hát và tạo playlist hoàn hảo của bạn
                        </p>
                        <div className="hero-actions">
                            {user ? (
                                <>
                                    <Link to="/music" className="btn-hero btn-primary-hero">
                                        Khám Phá Âm Nhạc
                                    </Link>
                                    <Link to="/playlists" className="btn-hero btn-secondary-hero">
                                        Playlist Của Tôi
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="btn-hero btn-primary-hero">
                                        Bắt Đầu Miễn Phí
                                    </Link>
                                    <Link to="/music" className="btn-hero btn-secondary-hero">
                                        Duyệt Âm Nhạc
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hero-illustration">
                        <img src="/logo.svg" alt="" className="hero-logo-icon" />
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            {user && (
                <section className="welcome-section">
                    <div className="welcome-container">
                        <h2>Chào mừng trở lại, <span className="user-name">{user.fullName || user.username}</span>!</h2>
                        <div className="quick-actions">
                            <Link to="/music" className="quick-action-card">
                                <img src="/logo.svg" alt="" className="action-icon" />
                                <h3>Duyệt Âm Nhạc</h3>
                                <p>Khám phá bài hát mới</p>
                            </Link>
                            <Link to="/playlists" className="quick-action-card">
                                <span className="action-icon">+</span>
                                <h3>Playlist Của Tôi</h3>
                                <p>Quản lý bộ sưu tập</p>
                            </Link>
                            <Link to="/profile" className="quick-action-card">
                                <span className="action-icon">●</span>
                                <h3>Hồ Sơ</h3>
                                <p>Xem tài khoản</p>
                            </Link>
                            {user.isAdmin && (
                                <Link to="/admin" className="quick-action-card admin-card">
                                    <span className="action-icon">⚙</span>
                                    <h3>Quản Trị</h3>
                                    <p>Quản lý hệ thống</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="features-section">
                <div className="features-container">
                    <h2 className="section-title">Tại Sao Chọn Music Web?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <img src="/logo.svg" alt="" className="feature-icon" />
                            <h3>Âm Thanh Chất Lượng Cao</h3>
                            <p>Trải nghiệm âm thanh trong trẻỏ với chất lượng cao cấp</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">+</div>
                            <h3>Playlist Tùy Chỉnh</h3>
                            <p>Tạo và sắp xếp playlist hoàn hảo cho mọi tâm trạng</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">☎</div>
                            <h3>Truy Cập Mọi Nơi</h3>
                            <p>Nghe nhạc trên mọi thiết bị, bất kỳ lúc nào, ở đâu</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">▶</div>
                            <h3>Gợi Ý Thông Minh</h3>
                            <p>Khám phá nhạc mới phù hợp với sở thích của bạn</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">★</div>
                            <h3>Chia Sẻ & Kết Nối</h3>
                            <p>Chia sẻ playlist yêu thích với bạn bè</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✓</div>
                            <h3>Bảo Mật & Riêng Tư</h3>
                            <p>Dữ liệu của bạn được bảo vệ với tiêu chuẩn bảo mật hàng đầu</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="cta-section">
                    <div className="cta-container">
                        <h2>Sẵn Sàng Bắt Đầu Hành Trình Âm Nhạc?</h2>
                        <p>Tham gia cùng hàng ngàn người yêu nhạc hôm nay</p>
                        <div className="cta-actions">
                            <Link to="/register" className="btn-cta btn-primary-cta">
                                Đăng Ký Ngay - Miễn Phí!
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
}

export default HomePage;

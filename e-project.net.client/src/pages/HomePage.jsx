// ... (imports remain same)
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';

function HomePage() {
    const { user } = useAuth();

    // Mock Data for UI Demo
    const newReleases = [
        { id: 1, title: "Midnight Rain", artist: "Taylor Swift", img: "🎵" },
        { id: 2, title: "As It Was", artist: "Harry Styles", img: "🎸" },
        { id: 3, title: "Flowers", artist: "Miley Cyrus", img: "🌸" },
        { id: 4, title: "Anti-Hero", artist: "Taylor Swift", img: "🌃" },
    ];

    const trendingArtists = [
        { id: 1, name: "The Weeknd", img: "🕶️" },
        { id: 2, name: "BTS", img: "💜" },
        { id: 3, name: "Mono", img: "🌙" },
        { id: 4, name: "Adele", img: "🎤" },
    ];

    return (
        <Layout>
            {/* Hero Banner */}
            <section className="relative rounded-3xl overflow-hidden mb-12 min-h-[400px] flex items-center justify-center text-center">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-background-start opacity-80" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                
                <div className="relative z-10 p-8 max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight text-text-primary">
                        Khám Phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-info">Âm Nhạc</span> Của Bạn
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
                        Nghe hàng triệu bài hát và tạo playlist hoàn hảo của bạn với chất lượng âm thanh tuyệt đỉnh.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user ? (
                            <>
                                <Link to="/music" className="btn-primary flex items-center justify-center gap-2">
                                    <span>🎵</span> Khám Phá Ngay
                                </Link>
                                <Link to="/playlists" className="px-8 py-3 rounded-full border border-border-color hover:bg-surface-hover transition-colors font-medium text-text-primary flex items-center justify-center gap-2">
                                    <span>📋</span> Playlist Của Tôi
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
                                    Bắt Đầu Miễn Phí
                                </Link>
                                <Link to="/music" className="px-8 py-3 rounded-full border border-border-color hover:bg-surface-hover transition-colors font-medium text-text-primary flex items-center justify-center gap-2">
                                    Duyệt Âm Nhạc
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Welcome / Dashboard Section */}
            {user && (
                <section className="mb-16 animate-slide-up">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-text-primary">Chào mừng trở lại, <span className="text-primary">{user.fullName || user.username}</span>! 👋</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/music" className="glass-panel p-6 flex flex-col items-center text-center group">
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎵</span>
                            <h3 className="font-bold text-lg mb-1 text-text-primary group-hover:text-primary transition-colors">Duyệt Âm Nhạc</h3>
                            <p className="text-sm text-text-muted">Khám phá bài hát mới</p>
                        </Link>
                        <Link to="/playlists" className="glass-panel p-6 flex flex-col items-center text-center group">
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</span>
                            <h3 className="font-bold text-lg mb-1 text-text-primary group-hover:text-primary transition-colors">Playlist Của Tôi</h3>
                            <p className="text-sm text-text-muted">Quản lý bộ sưu tập</p>
                        </Link>
                        <Link to="/profile" className="glass-panel p-6 flex flex-col items-center text-center group">
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</span>
                            <h3 className="font-bold text-lg mb-1 text-text-primary group-hover:text-primary transition-colors">Hồ Sơ</h3>
                            <p className="text-sm text-text-muted">Xem tài khoản</p>
                        </Link>
                        {user.isAdmin && (
                            <Link to="/admin" className="glass-panel p-6 flex flex-col items-center text-center group border-info/30 bg-info/5 hover:bg-info/10">
                                <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚙️</span>
                                <h3 className="font-bold text-lg mb-1 text-info">Quản Trị</h3>
                                <p className="text-sm text-text-muted">Quản lý hệ thống</p>
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* NEW: New Releases Section */}
            <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        🔥 Nhạc Mới Phát Hành
                    </h2>
                    <Link to="/music" className="text-sm text-primary hover:text-primary-hover font-medium">Xem tất cả</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {newReleases.map(item => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-surface mb-4 shadow-lg group-hover:shadow-primary/20 transition-all">
                                <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-background-start to-background-end">
                                    {item.img}
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                        ▶
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-sm text-text-secondary truncate">{item.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* NEW: Trending Artists Section */}
            <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        🎤 Nghệ Sĩ Xu Hướng
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {trendingArtists.map(artist => (
                        <div key={artist.id} className="glass-panel p-4 flex flex-col items-center text-center group hover:bg-surface-hover cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-primary mb-4 flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform">
                                {artist.img}
                            </div>
                            <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">{artist.name}</h3>
                            <p className="text-xs text-text-secondary mt-1">Artist</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Tại Sao Chọn Music Web?</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: "🎧", title: "Chất Lượng Cao", desc: "Trải nghiệm âm thanh trong trẻo, sống động" },
                        { icon: "📋", title: "Playlist Cá Nhân", desc: "Tạo và chia sẻ playlist theo gu của bạn" },
                        { icon: "🌐", title: "Mọi Lúc Mọi Nơi", desc: "Nghe nhạc trên mọi thiết bị bạn có" },
                        { icon: "🎯", title: "Gợi Ý Thông Minh", desc: "Khám phá nhạc mới mỗi ngày" }
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-panel p-6 text-center hover:-translate-y-1 transition-transform">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
                            <p className="text-text-muted text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="relative rounded-3xl overflow-hidden py-20 text-center">
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-3xl" />
                    <div className="relative z-10 px-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">Sẵn Sàng Bắt Đầu?</h2>
                        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">Tham gia cùng hàng ngàn người yêu nhạc và trải nghiệm không giới hạn ngay hôm nay.</p>
                        <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-xl shadow-pink-500/20">
                            Đăng Ký Tài Khoản Miễn Phí
                        </Link>
                    </div>
                </section>
            )}
        </Layout>
    );
}

export default HomePage;

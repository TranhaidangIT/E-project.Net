// ... (imports remain same)
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';

function HomePage() {
    const { user } = useAuth();

    return (
        <Layout>
            {/* Hero Banner - 2 Column Layout: Text Left, Logo Right */}
            <section className="relative rounded-2xl overflow-hidden mb-16 min-h-[500px] px-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-background-start opacity-80" />

                <div className="relative z-10 py-16 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Text Content */}
                        <div className="text-left">
                            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-text-primary mb-6">
                                Khám Phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Âm Nhạc</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed">
                                Nghe hàng triệu bài hát và tạo playlist hoàn hảo của bạn với chất lượng âm thanh tuyệt đỉnh.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {user ? (
                                    <>
                                        <Link to="/music" className="btn-primary px-12 py-4 text-lg text-center">
                                            Khám Phá Ngay
                                        </Link>
                                        <Link to="/playlists" className="px-12 py-4 text-lg rounded-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all font-semibold text-text-primary text-center">
                                            Playlist Của Tôi
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/register" className="btn-primary px-12 py-4 text-lg text-center">
                                            Bắt Đầu Miễn Phí
                                        </Link>
                                        <Link to="/music" className="px-12 py-4 text-lg rounded-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all font-semibold text-text-primary text-center">
                                            Duyệt Âm Nhạc
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Logo */}
                        <div className="flex justify-center lg:justify-end">
                            <img src="/wave-sound.png" alt="Music Web" className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 animate-pulse-slow" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Welcome / Dashboard Section - Better spacing */}
            {user && (
                <section className="mb-20">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">
                            Chào mừng trở lại, <span className="text-primary">{user.fullName || user.username}</span>
                        </h2>
                        <p className="text-text-secondary">Tiếp tục hành trình âm nhạc của bạn</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/music" className="glass-panel p-8 flex flex-col items-start group hover:border-primary transition-all">
                            <h3 className="font-bold text-xl mb-2 text-text-primary group-hover:text-primary transition-colors">Duyệt Âm Nhạc</h3>
                            <p className="text-sm text-text-muted">Khám phá bài hát mới</p>
                        </Link>
                        <Link to="/playlists" className="glass-panel p-8 flex flex-col items-start group hover:border-primary transition-all">
                            <h3 className="font-bold text-xl mb-2 text-text-primary group-hover:text-primary transition-colors">Playlist</h3>
                            <p className="text-sm text-text-muted">Quản lý bộ sưu tập</p>
                        </Link>
                        <Link to="/profile" className="glass-panel p-8 flex flex-col items-start group hover:border-primary transition-all">
                            <h3 className="font-bold text-xl mb-2 text-text-primary group-hover:text-primary transition-colors">Hồ Sơ</h3>
                            <p className="text-sm text-text-muted">Quản lý tài khoản</p>
                        </Link>
                        {user.isAdmin && (
                            <Link to="/admin" className="glass-panel p-8 flex flex-col items-start group border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all">
                                <h3 className="font-bold text-xl mb-2 text-primary">Quản Trị</h3>
                                <p className="text-sm text-text-muted">Quản lý hệ thống</p>
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* Features Section - Cleaner layout */}
            <section className="mb-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Tại Sao Chọn Music Web?</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Chất Lượng Cao", desc: "Trải nghiệm âm thanh trong trẻo, sống động với chất lượng tuyệt hảo" },
                        { title: "Playlist Cá Nhân", desc: "Tạo và chia sẻ playlist theo gu âm nhạc riêng của bạn" },
                        { title: "Mọi Lúc Mọi Nơi", desc: "Nghe nhạc trên mọi thiết bị, mọi nơi bạn muốn" },
                        { title: "Gợi Ý Thông Minh", desc: "Khám phá nhạc mới phù hợp với sở thích mỗi ngày" }
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-panel p-8 text-center hover:border-primary transition-all">
                            <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                            <p className="text-text-muted text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section - Better visual hierarchy */}
            {!user && (
                <section className="relative rounded-2xl overflow-hidden py-24 text-center mb-8">
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-3xl" />
                    <div className="relative z-10 px-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Sẵn Sàng Bắt Đầu?</h2>
                        <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                            Tham gia cùng hàng ngàn người yêu nhạc và trải nghiệm không giới hạn ngay hôm nay.
                        </p>
                        <Link to="/register" className="btn-primary text-lg px-12 py-4 inline-block">
                            Đăng Ký Tài Khoản Miễn Phí
                        </Link>
                    </div>
                </section>
            )}
        </Layout>
    );
}

export default HomePage;

# 🎵 Music Web - Ứng Dụng Nghe Nhạc Trực Tuyến

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Tính Năng](#-tính-năng)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt và Chạy Dự Án](#-cài-đặt-và-chạy-dự-án)
- [Cấu Hình & API](#-cấu-hình--api)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)

---

## 🎯 Giới Thiệu

**Music Web** là một nền tảng nghe nhạc trực tuyến hiện đại, được xây dựng theo kiến trúc **Full-Stack** mạnh mẽ. Dự án kết hợp sức mạnh của .NET 9 cho backend và React 19 cho frontend, mang lại trải nghiệm mượt mà và hiệu năng cao.

Hệ thống cho phép người dùng nghe nhạc MP3 tải lên, tạo playlist cá nhân, xem lịch sử nghe nhạc, và đặc biệt là **tính năng phát âm thanh từ YouTube** thông qua Embed API thông minh.

---

## 🛠️ Công Nghệ Sử Dụng

### 🔙 Backend (Server)

- **.NET 9.0** - Framework mới nhất của Microsoft, hiệu năng vượt trội.
- **ASP.NET Core Web API** - Xây dựng RESTful API chuẩn.
- **Entity Framework Core 9.0** - ORM tương tác với database.
- **SQL Server 2022** - Hệ quản trị cơ sở dữ liệu.
- **JWT Authentication** - Bảo mật và xác thực người dùng (Stateless).
- **BCrypt.Net** - Mã hóa mật khẩu an toàn.

### 🎨 Frontend (Client)

- **React 19.0** - Thư viện UI mới nhất.
- **Vite** - Build tool siêu tốc.
- **React Router v7** - Quản lý điều hướng client-side.
- **Axios** - Xử lý HTTP Request.
- **YouTube IFrame Player API** - Tích hợp phát nhạc từ YouTube.
- **CSS3 / Glassmorphism** - Giao diện hiện đại, hiệu ứng kính mờ.

---

## 📁 Cấu Trúc Thư Mục

```
d:/E-project.Net/
│
├── 📂 E-project.Net.Server/          # Backend Project (.NET 9)
│   ├── 📂 Controllers/               # API Endpoints
│   │   ├── AdminController.cs        # Quản lý Users (Admin)
│   │   ├── AuthController.cs         # Login/Register/Refresh
│   │   ├── HistoryController.cs      # Lịch sử nghe nhạc
│   │   ├── PlaylistController.cs     # Playlist CRUD
│   │   ├── SongController.cs         # Quản lý bài hát (MP3)
│   │   ├── UserController.cs         # Profile, Avatar
│   │   └── YouTubeController.cs      # Xử lý YouTube Embed & Metadata
│   │
│   ├── 📂 Data/                      # Database Context & Migrations
│   ├── 📂 Models/                    # Entity Class & DTOs
│   ├── 📂 Services/                  # Business Logic (Auth, etc.)
│   ├── Program.cs                    # Config DI, Pipeline, Middleware
│   └── appsettings.json              # Connection String & JWT Config
│
├── 📂 e-project.net.client/          # Frontend Project (React + Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/            # Reusable UI (Layout, Player, etc.)
│   │   ├── 📂 context/               # Global State (AuthContext)
│   │   ├── 📂 pages/                 # Các trang màn hình chính
│   │   │   ├── AdminDashboard.jsx    # Dashboard quản trị
│   │   │   ├── HomePage.jsx          # Trang chủ
│   │   │   ├── MusicPage.jsx         # Player nhạc MP3 upload
│   │   │   ├── YouTubePage.jsx       # Player nhạc YouTube
│   │   │   ├── ProfilePage.jsx       # Trang cá nhân user
│   │   │   └── SongManagement.jsx    # Admin quản lý bài hát
│   │   ├── 📂 services/              # API Calls wrapper
│   │   └── App.jsx                   # Main Router
│   │
│   ├── package.json                  # Dependencies (React 19, Axios...)
│   └── vite.config.js                # Proxy API config
│
└── 📂 Database/                      # SQL Scripts khởi tạo DB
```

---

## ✨ Tính Năng

### 👤 Người Dùng (User)

1.  **Authentication**: Đăng ký, Đăng nhập, Quên mật khẩu, Đổi mật khẩu.
2.  **Streaming Youtube**: Tính năng **MỚI**. Nhập URL YouTube -> Hệ thống tự động trích xuất Video ID và phát âm thanh qua player tích hợp, hỗ trợ Play/Pause/Volume mà không cần tải video.
3.  **Thư Viện Nhạc**: Nghe các bài hát MP3 được Admin upload.
4.  **Playlist Cá Nhân**: Tạo playlist, thêm/xóa bài hát yêu thích.
5.  **Lịch Sử Nghe Nhạc**: Xem lại các bài hát đã nghe.
6.  **Profile**: Cập nhật thông tin cá nhân, upload Avatar.

### 👑 Quản Trị Viên (Admin)

1.  **Dashboard**: Xem thống kê tổng quan hệ thống.
2.  **Quản Lý User**: Xem danh sách, tìm kiếm, phân quyền Admin, xóa User vi phạm.
3.  **Quản Lý Bài Hát**:
    - Upload file MP3 lên server.
    - Chỉnh sửa thông tin bài hát (Tên, Nghệ sĩ).
    - Xóa bài hát.

---

## 💻 Yêu Cầu Hệ Thống

- **OS**: Windows 10/11 (Development).
- **Runtime**: .NET 9.0 SDK.
- **Node.js**: Phiên bản 18 trở lên.
- **Database**: SQL Server (LocalDB hoặc SQL Server 2019+).

---

## 🚀 Cài Đặt và Chạy Dự Án

### Bước 1: Chuẩn bị Database

1.  Mở SQL Server Management Studio (SSMS).
2.  Chạy script trong `Database/music_web_database.sql` để tạo Database `MusicWebDB`.
3.  Đảm bảo chuỗi kết nối trong `E-project.Net.Server/appsettings.json` đúng với instance SQL Server của bạn.

### Bước 2: Chạy Backend (.NET)

Mở terminal tại thư mục gốc dự án:

```bash
cd E-project.Net.Server
dotnet restore
dotnet run
```

Backend sẽ khởi động tại: `https://localhost:7153` (hoặc cổng cấu hình trong launchSettings).

### Bước 3: Chạy Frontend (React)

Mở terminal **mới**:

```bash
cd e-project.net.client
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## ⚙️ Cấu Hình & API

### JWT Settings (appsettings.json)

```json
"JwtSettings": {
  "SecretKey": "Your_Super_Secret_Key_Here_Must_Be_Long_Enough",
  "Issuer": "http://localhost:5000",
  "Audience": "http://localhost:3000",
  "ExpiryMinutes": 60
}
```

### YouTube Integration logic

Backend không tải video về server để tránh vi phạm bản quyền và vấn đề băng thông. Thay vào đó:

1.  API `/api/youtube/info` nhận URL.
2.  Server lấy metadata (Title, Thumbnail) qua oEmbed.
3.  Server trả về `embedUrl` chuẩn.
4.  Client dùng `iframe` để phát trực tiếp từ YouTube Server nhưng ẩn hình ảnh, chỉ giữ âm thanh.

---

## 🐛 Troubleshooting

- **Lỗi CORS**: Đã cấu hình `Program.cs` cho phép `localhost:5173`. Nếu đổi port, hãy cập nhật lại `AllowedOrigins`.
- **Lỗi Database**: Kiểm tra kỹ ConnectionString. Chạy `dotnet ef database update` nếu dùng Migrations.
- **Không nghe được nhạc YouTube**: Do trình duyệt chặn AutoPlay. Hãy nhấn nút Play trên giao diện lần đầu tiên.

---

**© 2026 E-project.Net Team.**

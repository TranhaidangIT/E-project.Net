# 🎵 Music Web - Ứng Dụng Nghe Nhạc Trực Tuyến

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Tính Năng](#-tính-năng)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt và Chạy Dự Án](#-cài-đặt-và-chạy-dự-án)
- [Cấu Hình](#-cấu-hình)
- [API Endpoints](#-api-endpoints)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)

---

## 🎯 Giới Thiệu

**Music Web** là một ứng dụng web nghe nhạc trực tuyến hiện đại được xây dựng với kiến trúc **Full-Stack**, bao gồm:

- **Backend**: ASP.NET Core Web API với Entity Framework Core (`E-project.Net.Server`)
- **Frontend**: React + Vite (`e-project.net.client`)
- **Database**: SQL Server
- **Authentication**: JWT (JSON Web Token)

Ứng dụng cung cấp đầy đủ tính năng quản lý bài hát, playlist cá nhân, profile người dùng và phân quyền admin.

---

## 🛠️ Công Nghệ Sử Dụng

### Backend

- **ASP.NET Core 8.0** - Web API Framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **JWT Authentication** - Xác thực người dùng
- **BCrypt** - Mã hóa mật khẩu

### Frontend

- **React 19.0** - UI Library
- **Vite** - Build Tool
- **React Router** - Routing
- **Axios** - HTTP Client
- **CSS3** - Styling với Responsive Design

---

## 📁 Cấu Trúc Thư Mục

```
E-project.Net/
│
├── 📂 E-project.Net.Server/          # Backend ASP.NET Core
│   ├── 📂 Controllers/               # API Controllers
│   │   ├── AdminController.cs        # Quản lý users (Admin)
│   │   ├── AuthController.cs         # Đăng ký, đăng nhập, reset password
│   │   ├── PlaylistController.cs     # CRUD playlist & playlist songs
│   │   ├── SongController.cs         # CRUD bài hát & upload
│   │   └── UserController.cs         # Profile & Avatar
│   │
│   ├── 📂 Models/                    # Data Models & DTOs
│   │   ├── Song.cs                   # Entity Bài hát
│   │   ├── Playlist.cs               # Entity Playlist
│   │   ├── User.cs                   # Entity User
│   │   └── 📂 DTOs/                  # Data Transfer Objects
│   │
│   ├── 📂 Data/                      # Database Context
│   │   └── ApplicationDbContext.cs   # EF Core DbContext
│   │
│   ├── 📂 wwroot/                    # Static files
│   │   └── 📂 uploads/               # Chứa avatar và nhạc upload
│   │
│   ├── Program.cs                    # Entry point & Services Config
│   └── appsettings.json              # ConnectionString & JWT settings
│
├── 📂 e-project.net.client/          # Frontend React + Vite
│   ├── 📂 src/
│   │   ├── 📂 pages/                 # React Pages
│   │   │   ├── HomePage.jsx          # Trang chủ
│   │   │   ├── MusicPage.jsx         # Trang nghe nhạc chính
│   │   │   ├── ProfilePage.jsx       # Trang cá nhân
│   │   │   ├── SongManagement.jsx    # Quản lý bài hát (Admin)
│   │   │   ├── AdminDashboard.jsx    # Dashboard Admin
│   │   │   ├── LoginPage.jsx         # Đăng nhập
│   │   │   └── RegisterPage.jsx      # Đăng ký
│   │   │
│   │   ├── 📂 components/            # React Components
│   │   │   ├── Layout.jsx            # Header & Footer Layout
│   │   │   ├── MusicPlayer.jsx       # Player điều khiển nhạc
│   │   │   └── PlaylistManager.jsx   # Modal/Panel quản lý playlist
│   │   │
│   │   ├── 📂 context/               # Global State
│   │   │   └── AuthContext.jsx       # Quản lý trạng thái đăng nhập
│   │   │
│   │   ├── 📂 services/              # API Client
│   │   │   └── api.js                # Cấu hình Axios & Endpoints
│   │   │
│   │   └── App.jsx                   # Main App Router
│   │
│   ├── package.json                  # Dependencies (React, Axios, etc.)
│   └── vite.config.js                # Vite Proxy config
│
├── 📂 Database/                      # SQL Scripts
│   ├── music_web_database.sql        # Script tạo DB chính
│   └── ...
│
└── 📄 E-project.Net.sln              # Visual Studio Solution
```

---

## ✨ Tính Năng

### 🎵 Người Dùng (User)

- ✅ **Đăng ký / Đăng nhập** với JWT
- ✅ **Nghe nhạc**: Music player liên tục, danh sách bài hát
- ✅ **Playlist cá nhân**: Tạo, sửa, xóa, thêm bài hát
- ✅ **Profile**: Upload avatar, chỉnh sửa thông tin

### 👑 Quản Trị Viên (Admin)

- ✅ **Quản lý Users**: Xem danh sách, xóa user
- ✅ **Quản lý Bài hát**: Thêm (Upload MP3), Sửa, Xóa

---

## 💻 Yêu Cầu Hệ Thống

- **Backend**: .NET SDK 8.0, SQL Server
- **Frontend**: Node.js 18+, npm 9+
- **Database**: SQL Server (LocalDB hoặc Full)

---

## 🚀 Cài Đặt và Chạy Dự Án

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd E-project.Net
```

### Bước 2: Cài Đặt Database

1. Mở SQL Server Management Studio (SSMS).
2. Chạy script `Database/music_web_database.sql` để tạo database `MusicWebDB`.
3. (Tùy chọn) Chạy thêm các script bổ sung trong thư mục `Database/`.

### Bước 3: Chạy Backend

1. Mở `E-project.Net.Server/appsettings.json` và cập nhật ConnectionString nếu cần.
2. Mở terminal tại thư mục backend:

```bash
cd E-project.Net.Server
dotnet restore
dotnet run
```

Backend sẽ chạy tại: `https://localhost:5228`

### Bước 4: Chạy Frontend

Mở một terminal **mới** và đi vào thư mục client:

```bash
cd e-project.net.client
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## ⚙️ Cấu Hình Frontend Proxy

File `e-project.net.client/vite.config.js` đã được cấu hình để proxy các request `/api` sang backend:

```javascript
server: {
    proxy: {
        '/api': {
            target: 'https://localhost:5228',
            changeOrigin: true,
            secure: false
        }
    }
}
```

---

## 🐛 Troubleshooting

- **Lỗi 415 Unsupported Media Type**: Đã được sửa. Đảm bảo bạn đang chạy phiên bản mới nhất.
- **Backend không kết nối**: Kiểm tra xem Backend có đang chạy không và port có khớp với config proxy không.
- **Database Error**: Đảm bảo ConnectionString trong `appsettings.json` trỏ đúng tới SQL Server của bạn.

---

## 👨‍💻 Tác Giả

**E-project.Net Team**

---

🎉 **Enjoy Your Music!**

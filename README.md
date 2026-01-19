# 🎵 Music Web - Ứng Dụng Nghe Nhạc Trực Tuyến

## 📋 Mục Lục

dotnet run --project "E-project.Net.Server\E-project.Net.Server.csproj" --no-launch-profile

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

- **Backend**: ASP.NET Core Web API với Entity Framework Core
- **Frontend**: React + Vite với UI/UX hiện đại
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

- **React 19.2** - UI Library
- **Vite** - Build Tool
- **React Router** - Routing
- **Context API** - State Management
- **Axios** - HTTP Client
- **CSS3** - Styling với Responsive Design

### Tools

- **Visual Studio 2022** - IDE cho Backend
- **VS Code** - IDE cho Frontend
- **SQL Server Management Studio** - Quản lý Database

---

## 📁 Cấu Trúc Thư Mục

```
E-project.Net/
│
├── 📂 E-project.Net.Server/          # Backend ASP.NET Core
│   ├── 📂 Controllers/               # API Controllers
│   │   ├── AdminController.cs        # Quản lý admin (users, songs)
│   │   ├── AuthController.cs         # Đăng ký, đăng nhập, reset password
│   │   ├── PlaylistController.cs     # CRUD playlist
│   │   ├── SongController.cs         # Quản lý bài hát
│   │   └── UserController.cs         # Quản lý user profile
│   │
│   ├── 📂 Models/                    # Data Models
│   │   ├── User.cs                   # Model người dùng
│   │   ├── Song.cs                   # Model bài hát
│   │   ├── Playlist.cs               # Model playlist
│   │   ├── PlaylistSong.cs           # Bảng trung gian playlist-song
│   │   ├── PasswordResetToken.cs     # Token reset password
│   │   └── 📂 DTOs/                  # Data Transfer Objects
│   │       ├── LoginDto.cs
│   │       ├── RegisterDto.cs
│   │       ├── UpdateProfileDto.cs
│   │       ├── CreatePlaylistDto.cs
│   │       └── ...
│   │
│   ├── 📂 Data/                      # Database Context
│   │   └── ApplicationDbContext.cs   # EF Core DbContext
│   │
│   ├── 📂 Services/                  # Business Logic
│   │   ├── IAuthService.cs           # Interface xác thực
│   │   └── AuthService.cs            # Implement JWT, BCrypt
│   │
│   ├── 📂 wwwroot/                   # Static files (avatars)
│   │   └── uploads/avatars/
│   │
│   ├── Program.cs                    # Entry point, cấu hình services
│   ├── appsettings.json              # Cấu hình (ConnectionString, JWT)
│   └── E-project.Net.Server.csproj   # Project file
│
├── 📂 e-project.net.client/          # Frontend React (Legacy structure)
│   └── src/                          # Source code React
│
├── 📂 src/                           # Frontend React (Main)
│   ├── 📂 pages/                     # React Pages
│   │   ├── HomePage.jsx              # Trang chủ
│   │   ├── MusicPage.jsx             # Danh sách bài hát
│   │   ├── LoginPage.jsx             # Đăng nhập
│   │   ├── RegisterPage.jsx          # Đăng ký
│   │   ├── ProfilePage.jsx           # Profile cá nhân
│   │   ├── AdminDashboard.jsx        # Trang admin
│   │   ├── SongManagement.jsx        # Quản lý bài hát (Admin)
│   │   ├── ForgotPasswordPage.jsx    # Quên mật khẩu
│   │   ├── ResetPasswordPage.jsx     # Reset mật khẩu
│   │   └── ChangePasswordPage.jsx    # Đổi mật khẩu
│   │
│   ├── 📂 components/                # React Components
│   │   ├── Layout.jsx                # Layout chính (Header, Footer)
│   │   ├── MusicPlayer.jsx           # Music player component
│   │   └── PlaylistManager.jsx       # Quản lý playlist
│   │
│   ├── 📂 context/                   # React Context
│   │   ├── AuthContext.jsx           # Context xác thực
│   │   └── MusicContext.jsx          # Context music player
│   │
│   ├── 📂 services/                  # API Services
│   │   └── api.js                    # Axios instance, API calls
│   │
│   ├── 📂 hooks/                     # Custom Hooks
│   │   └── useAuth.js                # Hook xác thực
│   │
│   ├── App.jsx                       # Main App component
│   ├── App.css                       # Global styles
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Base styles
│
├── 📂 Database/                      # SQL Scripts
│   ├── music_web_database.sql        # Script tạo database và tables
│   ├── add_playlist_tables.sql       # Script thêm bảng playlist
│   └── add_password_reset_table.sql  # Script thêm bảng reset password
│
├── 📂 Tools/                         # Utility Tools
│   └── GeneratePasswordHash.csproj   # Tool tạo password hash
│
├── 📂 public/                        # Public assets
│   └── vite.svg
│
├── 📄 E-project.Net.sln              # Visual Studio Solution
├── 📄 package.json                   # NPM dependencies (root)
├── 📄 vite.config.js                 # Vite configuration
├── 📄 index.html                     # HTML entry point
│
└── 📄 Documentation/                 # Tài liệu
    ├── USER_GUIDE.md                 # Hướng dẫn sử dụng
    ├── IMPLEMENTATION_GUIDE.md       # Hướng dẫn triển khai
    ├── PLAYLIST_IMPLEMENTATION_GUIDE.md
    ├── UI_DESIGN_GUIDE.md
    ├── TOKEN_VS_DATABASE_AUTH.md
    └── FEATURES_COMPLETED.md
```

---

## ✨ Tính Năng

### 🎵 Người Dùng (User)

- ✅ **Đăng ký / Đăng nhập** với JWT Authentication
- ✅ **Quên mật khẩu** và reset qua email token
- ✅ **Xem danh sách bài hát** với tìm kiếm
- ✅ **Phát nhạc** với music player đầy đủ chức năng
- ✅ **Quản lý playlist cá nhân**:
  - Tạo playlist mới (Public/Private)
  - Thêm/Xóa bài hát khỏi playlist
  - Xóa playlist
  - Chuyển đổi Public/Private
- ✅ **Quản lý profile**:
  - Upload avatar (file hoặc URL)
  - Cập nhật họ tên
  - Xem thông tin tài khoản

### 👑 Quản Trị Viên (Admin)

- ✅ **Quản lý người dùng**:
  - Xem danh sách users
  - Toggle admin role
  - Xóa user
- ✅ **Quản lý bài hát** (CRUD):
  - Thêm bài hát mới
  - Sửa thông tin bài hát
  - Xóa bài hát
- ✅ **Xem thống kê** hệ thống

### 🎨 UI/UX

- ✅ **Responsive Design** (Desktop, Tablet, Mobile)
- ✅ **Modern UI** với animations và transitions
- ✅ **Dark theme** với gradient backgrounds
- ✅ **Music player** luôn hiển thị ở cuối trang
- ✅ **Real-time feedback** với toast notifications

---

## 💻 Yêu Cầu Hệ Thống

### Backend

- **.NET SDK 8.0** trở lên
- **SQL Server 2019** trở lên (hoặc SQL Server Express)
- **Visual Studio 2022** (khuyến nghị) hoặc VS Code với C# extension

### Frontend

- **Node.js 18.x** trở lên
- **npm 9.x** trở lên

### Database

- **SQL Server** với quyền tạo database

---

## 🚀 Cài Đặt và Chạy Dự Án

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd E-project.Net
```

### Bước 2: Cài Đặt Database

#### 2.1. Tạo Database

1. Mở **SQL Server Management Studio (SSMS)**
2. Kết nối đến SQL Server (localhost)
3. Mở file `Database/music_web_database.sql`
4. Chạy script để tạo database `MusicWebDB` và các bảng

#### 2.2. Chạy Migration Scripts (nếu cần)

```sql
-- Chạy lần lượt các file trong thư mục Database/
-- 1. music_web_database.sql
-- 2. add_playlist_tables.sql
-- 3. add_password_reset_table.sql
```

#### 2.3. Kiểm tra Database

Sau khi chạy script, database `MusicWebDB` sẽ có các bảng:

- `Users` - Người dùng
- `Songs` - Bài hát
- `Playlists` - Playlist
- `PlaylistSongs` - Quan hệ playlist-song
- `PasswordResetTokens` - Token reset password

### Bước 3: Cấu Hình Backend

#### 3.1. Cập nhật Connection String

Mở file `E-project.Net.Server/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MusicWebDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

> **Lưu ý**: Nếu SQL Server của bạn yêu cầu username/password:

```json
"DefaultConnection": "Server=localhost;Database=MusicWebDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
```

#### 3.2. Restore NuGet Packages

```bash
cd E-project.Net.Server
dotnet restore
```

#### 3.3. Chạy Backend

**Cách 1: Visual Studio**

1. Mở `E-project.Net.sln` trong Visual Studio
2. Set `E-project.Net.Server` làm Startup Project
3. Nhấn `F5` hoặc click **Run**

**Cách 2: Command Line**

```bash
cd E-project.Net.Server
dotnet run
```

Backend sẽ chạy tại: `https://localhost:5228` hoặc `http://localhost:5228`

### Bước 4: Cài Đặt và Chạy Frontend

#### 4.1. Cài đặt Dependencies

```bash
# Từ thư mục root của project
npm install
```

#### 4.2. Chạy Development Server

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

#### 4.3. Mở trình duyệt

Truy cập: `http://localhost:5173`

---

## ⚙️ Cấu Hình

### Backend Configuration (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MusicWebDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration2024MusicWebApp!@#$%",
    "Issuer": "MusicWebAPI",
    "Audience": "MusicWebClient",
    "ExpirationInDays": "7"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Frontend Configuration (`vite.config.js`)

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://localhost:5228",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### CORS Configuration

Backend đã cấu hình CORS cho phép frontend kết nối:

- `https://localhost:50494`
- `http://localhost:5173`
- `https://localhost:5173`

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint                    | Mô tả                    | Auth |
| ------ | --------------------------- | ------------------------ | ---- |
| POST   | `/api/auth/register`        | Đăng ký tài khoản mới    | ❌   |
| POST   | `/api/auth/login`           | Đăng nhập                | ❌   |
| POST   | `/api/auth/forgot-password` | Gửi email reset password | ❌   |
| POST   | `/api/auth/reset-password`  | Reset password với token | ❌   |

### User (`/api/user`)

| Method | Endpoint                    | Mô tả                 | Auth |
| ------ | --------------------------- | --------------------- | ---- |
| GET    | `/api/user/profile`         | Lấy thông tin profile | ✅   |
| PUT    | `/api/user/profile`         | Cập nhật profile      | ✅   |
| POST   | `/api/user/upload-avatar`   | Upload avatar (file)  | ✅   |
| POST   | `/api/user/change-password` | Đổi mật khẩu          | ✅   |

### Songs (`/api/songs`)

| Method | Endpoint          | Mô tả                 | Auth     |
| ------ | ----------------- | --------------------- | -------- |
| GET    | `/api/songs`      | Lấy danh sách bài hát | ❌       |
| GET    | `/api/songs/{id}` | Lấy chi tiết bài hát  | ❌       |
| POST   | `/api/songs`      | Thêm bài hát mới      | ✅ Admin |
| PUT    | `/api/songs/{id}` | Cập nhật bài hát      | ✅ Admin |
| DELETE | `/api/songs/{id}` | Xóa bài hát           | ✅ Admin |

### Playlists (`/api/playlists`)

| Method | Endpoint                                     | Mô tả                  | Auth |
| ------ | -------------------------------------------- | ---------------------- | ---- |
| GET    | `/api/playlists`                             | Lấy playlists của user | ✅   |
| GET    | `/api/playlists/{id}`                        | Lấy chi tiết playlist  | ✅   |
| POST   | `/api/playlists`                             | Tạo playlist mới       | ✅   |
| PUT    | `/api/playlists/{id}`                        | Cập nhật playlist      | ✅   |
| DELETE | `/api/playlists/{id}`                        | Xóa playlist           | ✅   |
| POST   | `/api/playlists/{id}/songs`                  | Thêm bài vào playlist  | ✅   |
| DELETE | `/api/playlists/{playlistId}/songs/{songId}` | Xóa bài khỏi playlist  | ✅   |

### Admin (`/api/admin`)

| Method | Endpoint                             | Mô tả                 | Auth     |
| ------ | ------------------------------------ | --------------------- | -------- |
| GET    | `/api/admin/users`                   | Lấy danh sách users   | ✅ Admin |
| PUT    | `/api/admin/users/{id}/toggle-admin` | Toggle admin role     | ✅ Admin |
| DELETE | `/api/admin/users/{id}`              | Xóa user              | ✅ Admin |
| GET    | `/api/admin/stats`                   | Lấy thống kê hệ thống | ✅ Admin |

---

## 📖 Hướng Dẫn Sử Dụng

### 1. Đăng Ký Tài Khoản

1. Truy cập `http://localhost:5173/register`
2. Nhập thông tin:
   - Username (duy nhất)
   - Email (duy nhất)
   - Password (tối thiểu 6 ký tự)
   - Confirm Password
3. Click **"Đăng ký"**

### 2. Đăng Nhập

1. Truy cập `http://localhost:5173/login`
2. Nhập Email và Password
3. Click **"Đăng nhập"**
4. Token JWT sẽ được lưu trong localStorage

### 3. Nghe Nhạc

1. Vào trang **Music** (`/music`)
2. Xem danh sách bài hát
3. Click vào bài hát để phát
4. Sử dụng music player ở cuối trang để điều khiển

### 4. Quản Lý Playlist

1. Vào trang **Playlists** (`/playlists`)
2. Click **"+ Create New Playlist"** để tạo mới
3. Thêm bài hát:
   - Từ trang Music: Click nút **➕** trên bài hát
   - Từ trang Playlists: Click **"+ Add Song"** trong playlist
4. Xóa bài: Click **"Remove"** bên cạnh bài hát
5. Xóa playlist: Click icon **🗑️**

### 5. Cập Nhật Profile

1. Vào trang **Profile** (`/profile`)
2. Click **"✏️ Chỉnh sửa"**
3. Upload avatar:
   - **Cách 1**: Click **"📷 Chọn ảnh"** → Chọn file
   - **Cách 2**: Nhập URL ảnh
4. Nhập họ tên
5. Click **"💾 Lưu"**

### 6. Admin (Chỉ dành cho Admin)

1. Đăng nhập với tài khoản admin
2. Truy cập `/admin`
3. Quản lý users và songs

---

## 🔐 Bảo Mật

- **Password Hashing**: BCrypt với salt rounds = 10
- **JWT Token**: Expire sau 7 ngày
- **HTTPS**: Khuyến nghị cho production
- **CORS**: Chỉ cho phép origins được cấu hình
- **Input Validation**: Validate trên cả client và server
- **SQL Injection Protection**: Sử dụng Entity Framework parameterized queries

---

## 🐛 Troubleshooting

### Backend không chạy

```bash
# Kiểm tra .NET SDK
dotnet --version

# Restore packages
dotnet restore

# Clean và rebuild
dotnet clean
dotnet build
```

### Frontend không kết nối Backend

1. Kiểm tra backend đang chạy tại `https://localhost:5228`
2. Kiểm tra CORS config trong `Program.cs`
3. Kiểm tra proxy trong `vite.config.js`
4. Clear browser cache (Ctrl+Shift+Delete)

### Database connection error

1. Kiểm tra SQL Server đang chạy
2. Kiểm tra connection string trong `appsettings.json`
3. Kiểm tra database `MusicWebDB` đã được tạo
4. Kiểm tra quyền truy cập database

### JWT Token hết hạn

- Đăng xuất và đăng nhập lại
- Token tự động expire sau 7 ngày

---

## 📝 Scripts NPM

```bash
# Development
npm run dev          # Chạy dev server (Vite)

# Build
npm run build        # Build production

# Preview
npm run preview      # Preview production build

# Lint
npm run lint         # Chạy ESLint
```

---

## 🎓 Tài Liệu Tham Khảo

- [USER_GUIDE.md](./USER_GUIDE.md) - Hướng dẫn sử dụng chi tiết
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Hướng dẫn triển khai
- [PLAYLIST_IMPLEMENTATION_GUIDE.md](./PLAYLIST_IMPLEMENTATION_GUIDE.md) - Hướng dẫn playlist
- [UI_DESIGN_GUIDE.md](./UI_DESIGN_GUIDE.md) - Hướng dẫn thiết kế UI
- [FEATURES_COMPLETED.md](./FEATURES_COMPLETED.md) - Danh sách tính năng đã hoàn thành

---

## 👨‍💻 Tác Giả

**E-project.Net Team**

---

## 📄 License

Dự án này được phát triển cho mục đích học tập.

---

## 🎉 Enjoy Your Music! 🎵🎧

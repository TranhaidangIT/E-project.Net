# 🎵 Music Web - Hướng Dẫn Triển Khai Dự Án

## 📋 Tổng Quan

Dự án Music Web là một ứng dụng nghe nhạc trực tuyến sử dụng:

- **Frontend**: React + Vite (Port 5173)
- **Backend**: ASP.NET Core Web API (.NET 9) (Port 5000)
- **Database**: SQL Server (localhost - MusicWebDB)
- **Authentication**: JWT Bearer Token + BCrypt Password Hashing

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

### 1. Chuẩn bị Database

```sql
-- Tạo database trong SQL Server Management Studio
CREATE DATABASE MusicWebDB;
```

### 2. Chạy Backend Server

```powershell
# Mở terminal, di chuyển đến thư mục project
cd "d:\.NET\E-project.Net\E-project.Net.Server"

# Build project
dotnet build

# Chạy server (không dùng launch profile để tránh lỗi SPA Proxy)
dotnet run --no-launch-profile
```

**✅ Backend chạy tại: http://localhost:5000**

### 3. Chạy Frontend Client

```powershell
# Mở terminal mới, di chuyển đến thư mục client
cd "d:\.NET\E-project.Net\e-project.net.client"

# Cài đặt dependencies (lần đầu)
npm install

# Chạy development server
npm run dev
```

**✅ Frontend chạy tại: http://localhost:5173**

### 4. Tạo Superadmin Account

#### 📁 File: `d:\.NET\E-project.Net\Tools\GeneratePasswordHash.cs`

```powershell
# Chạy tool tạo password hash
cd "d:\.NET\E-project.Net\Tools"
dotnet run
```

**Output:**
```
Password: Super@2024
Hash: $2a$11$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Chèn Superadmin vào Database:

```sql
-- Chạy trong SQL Server Management Studio
USE MusicWebDB;

INSERT INTO Users (Username, Email, PasswordHash, FullName, IsAdmin, CreatedAt)
VALUES (
    'superadmin',
    'admin@musicweb.com',
    '$2a$11$[HASH_FROM_TOOL]',  -- Thay bằng hash từ tool
    'Super Administrator',
    1,
    GETDATE()
);
```

**🔑 Thông tin đăng nhập Superadmin:**
- Username: `superadmin`
- Password: `Super@2024`

---

## 🗄️ Cấu Trúc Database

### Bảng Users

```sql
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(255),
    AvatarURL NVARCHAR(500),
    IsAdmin BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

| Field        | Type          | Mô tả                        |
| ------------ | ------------- | ------------------------------ |
| UserID       | INT           | ID tự động tăng            |
| Username     | NVARCHAR(100) | Tên đăng nhập (unique)     |
| Email        | NVARCHAR(255) | Email (unique)                 |
| PasswordHash | NVARCHAR(255) | Mật khẩu đã hash (BCrypt) |
| FullName     | NVARCHAR(255) | Họ tên đầy đủ            |
| AvatarURL    | NVARCHAR(500) | Đường dẫn ảnh đại diện |
| IsAdmin      | BIT           | Quyền admin (0/1)             |
| CreatedAt    | DATETIME      | Ngày tạo tài khoản         |

### Bảng PasswordResetTokens

```sql
CREATE TABLE PasswordResetTokens (
    TokenID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Token NVARCHAR(255) NOT NULL UNIQUE,
    ExpiresAt DATETIME NOT NULL,
    IsUsed BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
```

| Field     | Type          | Mô tả                              |
| --------- | ------------- | ------------------------------------ |
| TokenID   | INT           | ID tự động tăng                  |
| UserID    | INT           | ID người dùng (FK)                |
| Token     | NVARCHAR(255) | Mã khôi phục 6 ký tự (unique)   |
| ExpiresAt | DATETIME      | Thời gian hết hạn (15 phút)     |
| IsUsed    | BIT           | Đã sử dụng chưa (0/1)           |
| CreatedAt | DATETIME      | Ngày tạo token                     |

---

## 📂 CẤU TRÚC DỰ ÁN CHI TIẾT

### 🔷 BACKEND - E-project.Net.Server/

```
E-project.Net.Server/
├── Controllers/
│   ├── AuthController.cs      # Xử lý đăng ký, đăng nhập, đăng xuất
│   ├── UserController.cs      # Xử lý profile, đổi mật khẩu
│   └── AdminController.cs     # Quản lý users (Admin only)
├── Models/
│   ├── User.cs                # Entity model cho bảng Users
│   ├── PasswordResetToken.cs  # Entity model cho bảng PasswordResetTokens
│   └── DTOs/
│       ├── LoginDTO.cs        # Dữ liệu đăng nhập
│       ├── RegisterDTO.cs     # Dữ liệu đăng ký
│       ├── UserDTO.cs         # Response user (không có password)
│       ├── AuthResponseDTO.cs # Response đăng nhập/đăng ký
│       ├── UpdateProfileDTO.cs # Cập nhật thông tin
│       ├── ChangePasswordDTO.cs # Đổi mật khẩu
│       ├── ForgotPasswordDTO.cs # Quên mật khẩu - nhập email
│       ├── ResetPasswordDTO.cs  # Đặt lại mật khẩu
│       └── ValidateResetTokenDTO.cs # Validate token
├── Data/
│   └── ApplicationDbContext.cs # EF Core DbContext
├── Services/
│   ├── IAuthService.cs        # Interface authentication
│   └── AuthService.cs         # Implement auth logic
├── Program.cs                 # Cấu hình app, JWT, CORS, DI
└── appsettings.json           # Connection string, JWT config
```

### 🔶 FRONTEND - e-project.net.client/src/

```
e-project.net.client/src/
├── context/
│   └── AuthContext.jsx        # React Context quản lý auth state
├── services/
│   └── api.js                 # Axios instance & API calls
├── pages/
│   ├── HomePage.jsx           # Trang chủ
│   ├── LoginPage.jsx          # Trang đăng nhập
│   ├── RegisterPage.jsx       # Trang đăng ký
│   ├── ForgotPasswordPage.jsx # Trang quên mật khẩu
│   ├── ResetPasswordPage.jsx  # Trang đặt lại mật khẩu
│   ├── ProfilePage.jsx        # Trang thông tin cá nhân
│   └── AdminDashboard.jsx     # Trang quản trị (Admin)
├── App.jsx                    # Routes & Protected Routes
├── App.css                    # Styles
└── main.jsx                   # Entry point
```

### 🔧 TOOLS - Tools/

```
Tools/
├── GeneratePasswordHash.cs    # Tool tạo BCrypt hash
└── GeneratePasswordHash.csproj # Project file
```

---

## 📝 CHI TIẾT TỪNG FILE

### 🔷 BACKEND FILES

---

#### 📁 `Program.cs`
**Mục đích:** Cấu hình và khởi tạo ứng dụng ASP.NET Core

**Chức năng:**
- Cấu hình Entity Framework Core với SQL Server
- Cấu hình JWT Authentication
- Cấu hình CORS cho phép frontend truy cập
- Đăng ký Dependency Injection (Services)
- Cấu hình middleware pipeline

**Luồng xử lý:**
```
App Start → Load Config → Setup DI → Setup Auth → Setup CORS → Run
```

---

#### 📁 `appsettings.json`
**Mục đích:** Lưu trữ cấu hình ứng dụng

**Nội dung chính:**
- `ConnectionStrings.DefaultConnection`: Chuỗi kết nối SQL Server
- `JwtSettings.SecretKey`: Khóa bí mật cho JWT
- `JwtSettings.Issuer/Audience`: Thông tin JWT token
- `JwtSettings.ExpirationInDays`: Thời hạn token (7 ngày)

---

#### 📁 `Models/User.cs`
**Mục đích:** Entity model đại diện cho bảng Users trong database

**Properties:**
- `UserID`: Primary key
- `Username`, `Email`: Thông tin đăng nhập (unique)
- `PasswordHash`: Mật khẩu đã mã hóa BCrypt
- `FullName`, `AvatarURL`: Thông tin cá nhân
- `IsAdmin`: Phân quyền admin
- `CreatedAt`: Thời gian tạo

---

#### 📁 `Models/DTOs/LoginDTO.cs`
**Mục đích:** Nhận dữ liệu đăng nhập từ client

**Properties:**
- `Username`: Tên đăng nhập (Required)
- `Password`: Mật khẩu (Required)

---

#### 📁 `Models/DTOs/RegisterDTO.cs`
**Mục đích:** Nhận dữ liệu đăng ký từ client

**Properties:**
- `Username`: Tên đăng nhập (Required, MinLength: 3)
- `Email`: Email (Required, EmailAddress format)
- `Password`: Mật khẩu (Required, MinLength: 6)
- `ConfirmPassword`: Xác nhận mật khẩu (Compare với Password)
- `FullName`: Họ tên (Optional)

---

#### 📁 `Models/DTOs/UserDTO.cs`
**Mục đích:** Response data user (không chứa password)

**Properties:**
- Tất cả thông tin user trừ PasswordHash

---

#### 📁 `Models/DTOs/AuthResponseDTO.cs`
**Mục đích:** Response cho đăng nhập/đăng ký

**Properties:**
- `Success`: Thành công hay không
- `Message`: Thông báo
- `Token`: JWT token (khi đăng nhập thành công)
- `User`: Thông tin user (UserDTO)

---

#### 📁 `Models/DTOs/UpdateProfileDTO.cs`
**Mục đích:** Cập nhật thông tin cá nhân

**Properties:**
- `FullName`: Họ tên mới
- `AvatarURL`: URL avatar mới

---

#### 📁 `Models/DTOs/ChangePasswordDTO.cs`
**Mục đích:** Đổi mật khẩu

**Properties:**
- `CurrentPassword`: Mật khẩu hiện tại
- `NewPassword`: Mật khẩu mới (MinLength: 6)
- `ConfirmNewPassword`: Xác nhận mật khẩu mới

---

#### 📁 `Data/ApplicationDbContext.cs`
**Mục đích:** EF Core DbContext - Kết nối và thao tác database

**Chức năng:**
- Định nghĩa DbSet<User> cho bảng Users
- Cấu hình mapping entity với database
- Quản lý migrations

---

#### 📁 `Services/IAuthService.cs`
**Mục đích:** Interface định nghĩa các method authentication

**Methods:**
- `RegisterAsync(RegisterDTO)`: Đăng ký user mới
- `LoginAsync(LoginDTO)`: Đăng nhập
- `GetUserByIdAsync(int)`: Lấy user theo ID
- `UpdateProfileAsync(int, UpdateProfileDTO)`: Cập nhật profile
- `ChangePasswordAsync(int, ChangePasswordDTO)`: Đổi mật khẩu
- `DeleteAccountAsync(int)`: Xóa tài khoản

---

#### 📁 `Services/AuthService.cs`
**Mục đích:** Implement logic authentication

**Luồng xử lý Register:**
```
Nhận RegisterDTO → Validate unique username/email → Hash password (BCrypt)
→ Tạo User entity → Save DB → Return Success
```

**Luồng xử lý Login:**
```
Nhận LoginDTO → Tìm user theo username → Verify password (BCrypt)
→ Tạo JWT Token → Return Token + UserDTO
```

**Luồng xử lý Change Password:**
```
Nhận ChangePasswordDTO → Verify current password → Hash new password
→ Update DB → Return Success
```

---

#### 📁 `Controllers/AuthController.cs`
**Mục đích:** Xử lý API endpoints cho authentication

**Endpoints:**
| Method | Route | Mô tả | Auth |
|--------|-------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |
| POST | `/api/auth/forgot-password` | Yêu cầu khôi phục mật khẩu | ❌ |
| POST | `/api/auth/validate-reset-token` | Kiểm tra token hợp lệ | ❌ |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu mới | ❌ |

**Luồng Register:**
```
POST /api/auth/register
    ↓
[ApiController] validates RegisterDTO
    ↓
AuthService.RegisterAsync()
    ↓
Return AuthResponseDTO (Success/Error)
```

**Luồng Login:**
```
POST /api/auth/login
    ↓
[ApiController] validates LoginDTO
    ↓
AuthService.LoginAsync()
    ↓
Return AuthResponseDTO + JWT Token
```

---

#### 📁 `Controllers/UserController.cs`
**Mục đích:** Xử lý API endpoints cho user profile

**Endpoints:**
| Method | Route | Mô tả | Auth |
|--------|-------|-------|------|
| GET | `/api/user/profile` | Lấy thông tin profile | ✅ |
| PUT | `/api/user/profile` | Cập nhật profile | ✅ |
| PUT | `/api/user/change-password` | Đổi mật khẩu | ✅ |
| DELETE | `/api/user/delete` | Xóa tài khoản | ✅ |

**Luồng Get Profile:**
```
GET /api/user/profile + JWT Token
    ↓
[Authorize] middleware validates token
    ↓
Extract UserID from JWT Claims
    ↓
AuthService.GetUserByIdAsync(userId)
    ↓
Return UserDTO
```

---

#### 📁 `Controllers/AdminController.cs`
**Mục đích:** Xử lý API endpoints cho Admin quản lý users

**Endpoints:**
| Method | Route | Mô tả | Auth |
|--------|-------|-------|------|
| GET | `/api/admin/users` | Danh sách tất cả users | ✅ Admin |
| PUT | `/api/admin/users/{id}/role` | Thay đổi quyền admin | ✅ Admin |
| DELETE | `/api/admin/users/{id}` | Xóa user | ✅ Admin |

**Middleware kiểm tra Admin:**
```
Request + JWT Token
    ↓
[Authorize] validates token
    ↓
Check IsAdmin claim = true
    ↓
Allow access / Return 403 Forbidden
```

---

### 🔶 FRONTEND FILES

---

#### 📁 `main.jsx`
**Mục đích:** Entry point của React app

**Chức năng:**
- Render App component vào DOM
- Wrap với StrictMode

---

#### 📁 `App.jsx`
**Mục đích:** Component chính, cấu hình routing

**Chức năng:**
- Setup React Router
- Định nghĩa ProtectedRoute (yêu cầu đăng nhập)
- Định nghĩa AdminRoute (yêu cầu quyền admin)
- Định nghĩa PublicRoute (redirect nếu đã đăng nhập)
- Wrap app với AuthProvider

**Routes:**
| Route | Component | Protection |
|-------|-----------|------------|
| `/` | HomePage | Public |
| `/login` | LoginPage | PublicRoute |
| `/register` | RegisterPage | PublicRoute |
| `/profile` | ProfilePage | ProtectedRoute |
| `/admin` | AdminDashboard | AdminRoute |

---

#### 📁 `App.css`
**Mục đích:** Stylesheet cho toàn bộ ứng dụng

**Sections:**
- Auth forms styling (login, register)
- Navigation bar
- Profile page
- Admin dashboard & tables
- Buttons & inputs
- Responsive design

---

#### 📁 `context/AuthContext.jsx`
**Mục đích:** React Context quản lý authentication state

**State:**
- `user`: Thông tin user hiện tại (UserDTO)
- `isAuthenticated`: Trạng thái đăng nhập
- `loading`: Đang load dữ liệu

**Methods:**
- `login(credentials)`: Đăng nhập, lưu token, update state
- `register(userData)`: Đăng ký tài khoản
- `logout()`: Đăng xuất, xóa token, reset state

**Luồng khởi tạo:**
```
App Load → Check localStorage for token
    ↓
Token exists? → API /user/profile → Set user state
    ↓
Token invalid? → Clear token → Set unauthenticated
```

---

#### 📁 `services/api.js`
**Mục đích:** Axios instance và API service functions

**Cấu hình Axios:**
- BaseURL: `/api` (proxy đến backend)
- Auto attach JWT token từ localStorage
- Response interceptor xử lý 401 errors

**API Services:**
```javascript
// Auth APIs
authAPI.login(credentials)
authAPI.register(userData)
authAPI.logout()

// User APIs
userAPI.getProfile()
userAPI.updateProfile(data)
userAPI.changePassword(data)
userAPI.deleteAccount()

// Admin APIs
adminAPI.getAllUsers()
adminAPI.updateUserRole(userId, isAdmin)
adminAPI.deleteUser(userId)
```

---

#### 📁 `pages/HomePage.jsx`
**Mục đích:** Trang chủ của ứng dụng

**Chức năng:**
- Hiển thị welcome message
- Navigation đến Login/Register (nếu chưa đăng nhập)
- Navigation đến Profile/Admin (nếu đã đăng nhập)
- Logout button

---

#### 📁 `pages/LoginPage.jsx`
**Mục đích:** Trang đăng nhập

**Chức năng:**
- Form nhập username, password
- Validate input
- Gọi AuthContext.login()
- Redirect đến Home sau khi đăng nhập
- Link đến Register page

**Luồng xử lý:**
```
User nhập form → Submit
    ↓
AuthContext.login(credentials)
    ↓
API /api/auth/login
    ↓
Success → Save token → Navigate to "/"
    ↓
Error → Show error message
```

---

#### 📁 `pages/RegisterPage.jsx`
**Mục đích:** Trang đăng ký

**Chức năng:**
- Form nhập username, email, password, confirm password, fullname
- Validate input (password match)
- Gọi AuthContext.register()
- Redirect đến Login sau khi đăng ký
- Link đến Login page

**Luồng xử lý:**
```
User nhập form → Submit
    ↓
Validate password === confirmPassword
    ↓
AuthContext.register(userData)
    ↓
API /api/auth/register
    ↓
Success → Navigate to "/login"
    ↓
Error → Show error message
```

---

#### 📁 `pages/ProfilePage.jsx`
**Mục đích:** Trang thông tin cá nhân

**Chức năng:**
- Hiển thị thông tin user (username, email, fullname, avatar)
- Form cập nhật thông tin (fullname, avatar URL)
- Form đổi mật khẩu
- Nút xóa tài khoản

**Luồng cập nhật profile:**
```
User edit form → Submit
    ↓
userAPI.updateProfile(data)
    ↓
Success → Update local state → Show success message
```

**Luồng đổi mật khẩu:**
```
User nhập current/new/confirm password → Submit
    ↓
userAPI.changePassword(data)
    ↓
Success → Clear form → Show success message
```

---

#### 📁 `pages/AdminDashboard.jsx`
**Mục đích:** Trang quản trị cho Admin

**Chức năng:**
- Hiển thị danh sách tất cả users (table)
- Thay đổi quyền admin cho user
- Xóa user
- Chỉ accessible với IsAdmin = true

**Luồng xử lý:**
```
Component mount → adminAPI.getAllUsers()
    ↓
Render table với user data
    ↓
Click "Toggle Admin" → adminAPI.updateUserRole()
    ↓
Click "Delete" → Confirm → adminAPI.deleteUser()
    ↓
Refresh user list
```

---

### 🔧 TOOLS FILES

---

#### 📁 `Tools/GeneratePasswordHash.cs`
**Mục đích:** Tool console để tạo BCrypt hash cho superadmin

**Địa chỉ file:** `d:\.NET\E-project.Net\Tools\GeneratePasswordHash.cs`

**Cách chạy:**
```powershell
cd "d:\.NET\E-project.Net\Tools"
dotnet run
```

**Output:**
```
=== Superadmin Password Hash Generator ===
Password: Super@2024
Hash: $2a$11$[generated_hash]

-- SQL để insert superadmin:
INSERT INTO Users (Username, Email, PasswordHash, FullName, IsAdmin, CreatedAt)
VALUES ('superadmin', 'admin@musicweb.com', '$2a$11$[hash]', 'Super Administrator', 1, GETDATE());
```

---

## 🔄 LUỒNG XỬ LÝ TỔNG QUAN

### Flow 1: Đăng Ký (Register)

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. User truy cập /register                                          │
│  2. Nhập form: username, email, password, confirm, fullname          │
│  3. Submit → RegisterPage.jsx                                        │
│  4. AuthContext.register() → api.js (authAPI.register)               │
│  5. POST /api/auth/register → AuthController.Register()              │
│  6. AuthService.RegisterAsync()                                      │
│     - Check username/email unique                                    │
│     - BCrypt.HashPassword(password)                                  │
│     - DbContext.Users.Add(user)                                      │
│     - SaveChangesAsync()                                             │
│  7. Return AuthResponseDTO                                           │
│  8. Frontend redirect → /login                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 2: Đăng Nhập (Login)

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. User truy cập /login                                             │
│  2. Nhập form: username, password                                    │
│  3. Submit → LoginPage.jsx                                           │
│  4. AuthContext.login() → api.js (authAPI.login)                     │
│  5. POST /api/auth/login → AuthController.Login()                    │
│  6. AuthService.LoginAsync()                                         │
│     - Find user by username                                          │
│     - BCrypt.Verify(password, hash)                                  │
│     - Generate JWT Token (với claims: userId, username, isAdmin)     │
│  7. Return AuthResponseDTO + Token                                   │
│  8. Frontend:                                                        │
│     - localStorage.setItem("token", token)                           │
│     - Update AuthContext state                                       │
│     - Navigate → /                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 3: Truy Cập Protected Route

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. User truy cập /profile                                           │
│  2. App.jsx → ProtectedRoute check isAuthenticated                   │
│  3. Không có token → redirect /login                                 │
│  4. Có token → render ProfilePage                                    │
│  5. ProfilePage mount → userAPI.getProfile()                         │
│  6. api.js attach token vào header Authorization                     │
│  7. GET /api/user/profile → [Authorize] middleware                   │
│     - Validate JWT token                                             │
│     - Extract userId từ claims                                       │
│  8. UserController.GetProfile() → AuthService.GetUserByIdAsync()     │
│  9. Return UserDTO                                                   │
│  10. Frontend render user info                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 4: Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. User truy cập /admin                                             │
│  2. App.jsx → AdminRoute check isAuthenticated + user.isAdmin        │
│  3. Không phải admin → redirect /                                    │
│  4. Là admin → render AdminDashboard                                 │
│  5. AdminDashboard mount → adminAPI.getAllUsers()                    │
│  6. GET /api/admin/users + JWT token                                 │
│  7. AdminController kiểm tra IsAdmin claim                           │
│  8. Return danh sách users                                           │
│  9. Frontend render table                                            │
│  10. Admin actions: toggle role, delete user → API calls             │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 5: Đăng Xuất (Logout)

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. User click Logout button                                         │
│  2. AuthContext.logout()                                             │
│  3. localStorage.removeItem("token")                                 │
│  4. Set user = null, isAuthenticated = false                         │
│  5. Navigate → /login                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 6: Quên Mật Khẩu (Forgot Password)

```
┌─────────────────────────────────────────────────────────────────────┐
│  BƯỚC 1: Yêu cầu khôi phục                                          │
│  1. User truy cập /login → Click "Quên mật khẩu?"                │
│  2. Navigate → /forgot-password                                      │
│  3. Nhập email → Submit                                              │
│  4. POST /api/auth/forgot-password → AuthController                  │
│  5. AuthService.ForgotPasswordAsync()                                │
│     - Tìm user theo email                                           │
│     - Tạo token 6 ký tự ngẫu nhiên                                 │
│     - Lưu token vào PasswordResetTokens (expire 15 phút)            │
│  6. Return token + success message                                   │
│  7. Frontend hiển thị token và tự động chuyển hướng                │
│     → /reset-password?token=XXXXXX                                   │
│                                                                      │
│  BƯỚC 2: Validate token (Optional)                                  │
│  1. ResetPasswordPage mount → validate token                         │
│  2. POST /api/auth/validate-reset-token                              │
│  3. AuthService.ValidateResetTokenAsync()                            │
│     - Check token tồn tại                                           │
│     - Check IsUsed = false                                           │
│     - Check ExpiresAt > Now                                          │
│  4. Token valid → Hiển thị form                                     │
│     Token invalid → Show error + redirect                            │
│                                                                      │
│  BƯỚC 3: Đặt lại mật khẩu                                          │
│  1. User nhập newPassword + confirmPassword → Submit                 │
│  2. POST /api/auth/reset-password                                    │
│  3. AuthService.ResetPasswordAsync()                                 │
│     - Validate token (như bước 2)                                   │
│     - BCrypt.HashPassword(newPassword)                               │
│     - Update user.PasswordHash                                       │
│     - Set token.IsUsed = true                                        │
│     - SaveChangesAsync()                                             │
│  4. Return success message                                           │
│  5. Frontend navigate → /login                                       │
│  6. User đăng nhập với mật khẩu mới                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 PHẦN 1: ACCOUNT - USER - LOGIN - LOGOUT (CHI TIẾT CODE)

### 1.1 Backend (.NET Core API)

#### 📁 Cấu trúc thư mục:

```
E-project.Net.Server/
├── Controllers/
│   ├── AuthController.cs      
│   ├── UserController.cs      
│   └── AdminController.cs     
├── Models/
│   ├── User.cs                
│   └── DTOs/
│       ├── LoginDTO.cs        
│       ├── RegisterDTO.cs     
│       ├── UserDTO.cs         
│       ├── AuthResponseDTO.cs 
│       ├── UpdateProfileDTO.cs
│       └── ChangePasswordDTO.cs
├── Data/
│   └── ApplicationDbContext.cs
├── Services/
│   ├── IAuthService.cs        
│   └── AuthService.cs         
├── Program.cs                 
└── appsettings.json           
```

---

#### 📝 1.1.1 Model - User.cs

```csharp
public class User
{
    public int UserID { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string? FullName { get; set; }
    public string? AvatarURL { get; set; }
    public bool IsAdmin { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
```

---

#### 📝 1.1.2 DTOs (Data Transfer Objects)

**LoginDTO.cs**

```csharp
public class LoginDTO
{
    [Required]
    public string Username { get; set; }
  
    [Required]
    public string Password { get; set; }
}
```

**RegisterDTO.cs**

```csharp
public class RegisterDTO
{
    [Required]
    [MinLength(3)]
    public string Username { get; set; }
  
    [Required]
    [EmailAddress]
    public string Email { get; set; }
  
    [Required]
    [MinLength(6)]
    public string Password { get; set; }
  
    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; }
  
    public string? FullName { get; set; }
}
```

**UserDTO.cs** (Response - không chứa password)

```csharp
public class UserDTO
{
    public int UserID { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string? FullName { get; set; }
    public string? AvatarURL { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

**AuthResponseDTO.cs**

```csharp
public class AuthResponseDTO
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string? Token { get; set; }
    public UserDTO? User { get; set; }
}
```

---

### 1.2 Frontend (React)

#### 📁 Cấu trúc thư mục:

```
e-project.net.client/src/
├── context/
│   └── AuthContext.jsx        # Quản lý state đăng nhập
├── services/
│   └── api.js                 # Axios instance & API calls
├── pages/
│   ├── HomePage.jsx           # Trang chủ
│   ├── LoginPage.jsx          # Trang đăng nhập
│   ├── RegisterPage.jsx       # Trang đăng ký
│   ├── ProfilePage.jsx        # Trang cá nhân
│   └── AdminDashboard.jsx     # Trang quản trị
├── App.jsx                    # Routes configuration
├── App.css                    # Styles
└── main.jsx                   # Entry point
```

---

### 1.3 API Endpoints

| Method | Endpoint                      | Mô tả                | Auth Required |
| ------ | ----------------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/register`        | Đăng ký tài khoản | ❌            |
| POST   | `/api/auth/login`           | Đăng nhập           | ❌            |
| POST   | `/api/auth/logout`          | Đăng xuất           | ✅            |
| POST   | `/api/auth/forgot-password` | Quên mật khẩu - lấy token | ❌    |
| POST   | `/api/auth/validate-reset-token` | Kiểm tra token hợp lệ | ❌  |
| POST   | `/api/auth/reset-password`  | Đặt lại mật khẩu   | ❌            |
| GET    | `/api/user/profile`         | Lấy thông tin user   | ✅            |
| PUT    | `/api/user/profile`         | Cập nhật thông tin  | ✅            |
| PUT    | `/api/user/change-password` | Đổi mật khẩu       | ✅            |
| DELETE | `/api/user/delete`          | Xóa tài khoản       | ✅            |
| GET    | `/api/admin/users`          | Danh sách users      | ✅ Admin      |
| PUT    | `/api/admin/users/{id}/role`| Thay đổi quyền     | ✅ Admin      |
| DELETE | `/api/admin/users/{id}`     | Xóa user             | ✅ Admin      |

---

#### 📁 `pages/ForgotPasswordPage.jsx`
**Mục đích:** Trang yêu cầu khôi phục mật khẩu

**Chức năng:**
- Form nhập email đã đăng ký
- Validate email format
- Gọi authAPI.forgotPassword()
- Hiển thị token 6 ký tự
- Tự động chuyển sang ResetPasswordPage sau 2 giây
- Link quay lại Login

**Luồng xử lý:**
```
User nhập email → Submit
    ↓
authAPI.forgotPassword({ email })
    ↓
API /api/auth/forgot-password
    ↓
Success → Hiển thị token → Navigate to "/reset-password?token=XXX"
    ↓
Error → Show error message
```

---

#### 📁 `pages/ResetPasswordPage.jsx`
**Mục đích:** Trang đặt lại mật khẩu mới

**Chức năng:**
- Lấy token từ URL query parameter
- Auto-validate token khi mount
- Form nhập password mới + confirm password
- Validate password match
- Gọi authAPI.resetPassword()
- Redirect đến Login sau khi thành công

**Luồng xử lý:**
```
Component mount → Get token from URL
    ↓
authAPI.validateResetToken({ token })
    ↓
Token valid → Show form
Token invalid → Show error + link to forgot-password
    ↓
User nhập password → Submit
    ↓
authAPI.resetPassword({ token, newPassword, confirmPassword })
    ↓
Success → Alert → Navigate to "/login"
    ↓
Error → Show error message
```

---

### 1.4 Security Notes

1. **Password Hashing**: Sử dụng BCrypt để hash password
2. **JWT Token**:
   - Thời gian hết hạn: 7 ngày
   - Lưu trữ trong localStorage
3. **Validation**: Validate cả frontend và backend
4. **CORS**: Cấu hình cho phép frontend access API

---

## 📅 Phần Tiếp Theo (Coming Soon)

- [ ] Phần 2: Songs Management
- [ ] Phần 3: Playlist Feature
- [ ] Phần 4: Favorites & History
- [ ] Phần 5: Admin Dashboard (Mở rộng)

---

## 📚 THAM KHẢO NHANH

### Packages đã cài đặt:

**Backend (NuGet):**
```
Microsoft.EntityFrameworkCore.SqlServer (9.0.0)
Microsoft.AspNetCore.Authentication.JwtBearer (9.0.0)
BCrypt.Net-Next (4.0.3)
```

**Frontend (npm):**
```
axios
react-router-dom
```

### Cấu hình quan trọng:

**Connection String (appsettings.json):**
```json
"ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MusicWebDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

**JWT Settings (appsettings.json):**
```json
"JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration2024!@#$%",
    "Issuer": "MusicWebAPI",
    "Audience": "MusicWebClient",
    "ExpirationInDays": 7
}
```

**Vite Proxy (vite.config.js):**
```javascript
server: {
    proxy: {
        '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false
        }
    }
}
```

---

*Tài liệu cập nhật: 18/01/2026*

---

## 🆕 CẬP NHẬT MỚI NHẤT

### ✅ Tính năng Quên Mật Khẩu (Forgot Password) - 18/01/2026

Đã triển khai đầy đủ tính năng khôi phục mật khẩu:

**Backend Changes:**
- ✅ Thêm bảng `PasswordResetTokens` vào database
- ✅ Model `PasswordResetToken.cs` 
- ✅ DTOs: `ForgotPasswordDTO`, `ResetPasswordDTO`, `ValidateResetTokenDTO`
- ✅ AuthService: 3 methods mới (ForgotPassword, ValidateToken, ResetPassword)
- ✅ AuthController: 3 endpoints mới

**Frontend Changes:**
- ✅ `ForgotPasswordPage.jsx` - Trang nhập email lấy mã khôi phục
- ✅ `ResetPasswordPage.jsx` - Trang đặt lại mật khẩu mới
- ✅ Cập nhật `api.js` với 3 API methods mới
- ✅ Thêm routes `/forgot-password` và `/reset-password`
- ✅ Thêm link "Quên mật khẩu?" vào LoginPage
- ✅ CSS styles cho các trang mới

**Quy trình:**
1. User click "Quên mật khẩu?" → Nhập email → Nhận token 6 ký tự
2. Tự động chuyển sang trang Reset Password
3. Nhập mật khẩu mới → Hoàn tất → Đăng nhập lại

**Bảo mật:**
- Token có hiệu lực 15 phút
- Token chỉ sử dụng được 1 lần
- Mật khẩu mới được hash bằng BCrypt

---

# 🎵 Music Web - Hướng Dẫn Sử Dụng

## Giới Thiệu
Music Web là ứng dụng nghe nhạc trực tuyến với đầy đủ tính năng quản lý playlist, profile cá nhân và avatar.

---

## 🚀 Các Tính Năng Chính

### 1. 🎧 Nghe Nhạc
- **Trang Music** (`/music`): Xem tất cả bài hát
- Click vào bài hát để phát nhạc
- Sử dụng music player ở cuối trang để điều khiển
- Tìm kiếm bài hát theo tên hoặc nghệ sĩ

### 2. 📋 Quản Lý Playlist
- **Trang Playlists** (`/playlists`): Quản lý playlist của bạn

#### Tạo Playlist Mới
1. Click nút **"+ Create New Playlist"**
2. Nhập tên playlist
3. Nhập mô tả (tùy chọn)
4. Chọn **Public** nếu muốn mọi người xem được
5. Click **"Create Playlist"**

#### Thêm Bài Hát Vào Playlist
**Cách 1: Từ Trang Music**
1. Mở trang `/music`
2. Click nút **➕** trên bài hát bạn muốn thêm
3. Chọn playlist từ danh sách
4. Bài hát sẽ được thêm vào playlist

**Cách 2: Từ Trang Playlists**
1. Click vào playlist trong danh sách bên trái
2. Click nút **"+ Add Song"**
3. Chọn bài hát từ danh sách
4. Click **"Add"**

#### Xóa Bài Khỏi Playlist
1. Mở playlist trong trang `/playlists`
2. Click nút **"Remove"** bên cạnh bài hát

#### Xóa Playlist
1. Click icon **🗑️** trên playlist trong danh sách
2. Xác nhận xóa

#### Chuyển Public/Private
- Click icon **🔒** (Private) hoặc **🔓** (Public) để chuyển đổi

### 3. 👤 Profile Cá Nhân
- **Trang Profile** (`/profile`): Quản lý thông tin cá nhân

#### Xem Profile
- Username
- Email
- Họ tên
- Avatar
- Vai trò (User/Admin)
- Số lượng playlist
- Ngày tạo tài khoản

#### Cập Nhật Profile
1. Click nút **"✏️ Chỉnh sửa"**
2. Upload avatar (2 cách):
   - **Cách 1**: Click **"📷 Chọn ảnh"** → Chọn file từ máy
   - **Cách 2**: Nhập URL ảnh vào ô "Avatar URL"
3. Nhập họ tên
4. Click **"💾 Lưu"**

**Lưu ý về Avatar:**
- Chấp nhận: JPEG, PNG, GIF
- Kích thước tối đa: 5MB
- Có preview trước khi lưu

### 4. 🔐 Xác Thực

#### Đăng Ký
1. Truy cập `/register`
2. Nhập:
   - Username
   - Email
   - Password
   - Confirm Password
3. Click **"Đăng ký"**

#### Đăng Nhập
1. Truy cập `/login`
2. Nhập Email và Password
3. Click **"Đăng nhập"**

#### Quên Mật Khẩu
1. Click **"Quên mật khẩu?"** trong trang login
2. Nhập email
3. Kiểm tra email để lấy link reset
4. Click link và nhập mật khẩu mới

---

## 🎨 Giao Diện

### Navigation
**Khi Chưa Đăng Nhập:**
- Home → Music → Login → Register

**Khi Đã Đăng Nhập:**
- Home → Music → **📋 Playlists** → Profile → Logout

### Music Player
- Hiển thị ở cuối trang
- Tên bài hát & nghệ sĩ
- Nút Play/Pause
- Nút Previous/Next
- Timeline và volume control

---

## 📱 Responsive Design

Giao diện tự động điều chỉnh trên:
- 💻 Desktop (1200px+)
- 💻 Laptop (768px - 1199px)
- 📱 Tablet (481px - 767px)
- 📱 Mobile (< 480px)

---

## ⚙️ Admin Features

**Chỉ dành cho Admin:**
- Quản lý users
- Quản lý bài hát (CRUD)
- Xem thống kê
- Toggle admin role cho users

Truy cập: `/admin`

---

## 🎯 Tips & Tricks

### Nghe Nhạc
- Double click vào bài hát để phát nhanh
- Sử dụng phím tắt trong player (nếu có)
- Playlist tự động phát bài tiếp theo

### Quản Lý Playlist
- Tạo playlist theo chủ đề (Workout, Relax, Study...)
- Sử dụng Public playlist để chia sẻ
- Private playlist chỉ bạn xem được
- Có thể thêm cùng 1 bài vào nhiều playlist

### Profile
- Upload avatar chất lượng cao cho đẹp
- Cập nhật họ tên đầy đủ
- Kiểm tra số lượng playlist đã tạo

---

## 🚨 Xử Lý Lỗi

### "401 Unauthorized"
- Token hết hạn → Đăng xuất và đăng nhập lại

### "Song already in playlist"
- Bài hát đã có trong playlist → Chọn bài khác

### "Playlist not found"
- Playlist đã bị xóa → Refresh trang

### "Failed to upload avatar"
- Kiểm tra:
  - File type (JPEG/PNG/GIF only)
  - File size (< 5MB)
  - Kết nối internet

### Frontend không kết nối Backend
- Kiểm tra backend đang chạy (`http://localhost:5228`)
- Kiểm tra vite proxy config
- Refresh browser (Ctrl+F5)

---

## 🔒 Bảo Mật

- Password được hash với BCrypt
- JWT token expire sau 7 ngày
- HTTPS recommended cho production
- CORS được config cho security
- Validate input trên cả client & server

---

## 📞 Support

Nếu gặp vấn đề:
1. Check browser console (F12)
2. Check backend logs
3. Xem PLAYLIST_IMPLEMENTATION_GUIDE.md
4. Contact admin

---

## 🎉 Tính Năng Sắp Tới

- [ ] Social sharing playlists
- [ ] Like/Follow users
- [ ] Comments on songs
- [ ] Playlist collaboration
- [ ] Mobile app
- [ ] Dark/Light theme toggle
- [ ] Audio visualizer
- [ ] Lyrics display

---

**Enjoy Your Music! 🎵🎧**

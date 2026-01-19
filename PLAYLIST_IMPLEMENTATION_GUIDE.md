# Hướng Dẫn Triển Khai Playlist & Profile Features

## Tổng Quan
Đã triển khai đầy đủ các tính năng:
- ✅ Quản lý Playlist (Tạo/Xóa/Sửa/Xem)
- ✅ Thêm/Xóa bài hát khỏi Playlist
- ✅ Playlist công khai/riêng tư
- ✅ Upload Avatar
- ✅ Cập nhật Profile (Họ tên, Avatar)
- ✅ Đếm số lượng Playlist của User

---

## Backend - ASP.NET Core

### 1. Models Đã Tạo

#### Playlist.cs
```csharp
- PlaylistID (Primary Key)
- UserID (Foreign Key -> Users)
- PlaylistName
- Description
- IsPublic (true/false)
- CreatedAt, UpdatedAt
- Navigation: User, PlaylistSongs
```

#### PlaylistSong.cs (Junction Table)
```csharp
- PlaylistSongID (Primary Key)
- PlaylistID (Foreign Key -> Playlists)
- SongID (Foreign Key -> Songs)
- OrderIndex (Thứ tự bài hát trong playlist)
- AddedAt
```

### 2. Controllers

#### PlaylistController.cs
**Endpoints:**
- `GET /api/playlist/my-playlists` - Lấy tất cả playlist của user
- `GET /api/playlist/public` - Lấy playlist công khai
- `GET /api/playlist/{id}` - Chi tiết playlist (bao gồm danh sách bài hát)
- `POST /api/playlist` - Tạo playlist mới
- `PUT /api/playlist/{id}` - Cập nhật thông tin playlist
- `DELETE /api/playlist/{id}` - Xóa playlist
- `POST /api/playlist/{id}/songs` - Thêm bài hát vào playlist
- `DELETE /api/playlist/{playlistId}/songs/{songId}` - Xóa bài hát khỏi playlist
- `PUT /api/playlist/{id}/reorder` - Sắp xếp lại thứ tự bài hát

#### UserController.cs (Đã cập nhật)
**Endpoints:**
- `GET /api/user/profile` - Lấy thông tin profile (bao gồm số lượng playlist)
- `PUT /api/user/profile` - Cập nhật profile
- `POST /api/user/upload-avatar` - Upload ảnh avatar
- `PUT /api/user/change-password` - Đổi mật khẩu
- `DELETE /api/user/delete` - Xóa tài khoản

### 3. DTOs
- `PlaylistDTO` - Thông tin cơ bản playlist
- `PlaylistDetailDTO` - Chi tiết playlist + danh sách bài hát
- `PlaylistSongDTO` - Thông tin bài hát trong playlist
- `CreatePlaylistDTO` - Tạo playlist mới
- `UpdatePlaylistDTO` - Cập nhật playlist
- `AddSongToPlaylistDTO` - Thêm bài vào playlist
- `UserProfileDTO` - Profile user (có PlaylistCount)
- `UpdateProfileDTO` - Cập nhật profile

---

## Frontend - React

### 1. Components Mới

#### PlaylistManager.jsx
Component quản lý playlist với giao diện 2 cột:
- **Cột trái**: Danh sách playlist
- **Cột phải**: Chi tiết playlist & danh sách bài hát

**Tính năng:**
- Tạo playlist mới (modal)
- Xóa playlist
- Thêm bài hát vào playlist (modal)
- Xóa bài khỏi playlist
- Chuyển đổi Public/Private
- Hiển thị số lượng bài hát
- Responsive design

#### PlaylistManager.css
CSS với theme tối, hiệu ứng hover, và modal đẹp.

### 2. Pages Đã Cập Nhật

#### ProfilePage.jsx
Thêm tính năng:
- Upload avatar bằng file
- Preview ảnh trước khi lưu
- Validate file type (JPEG, PNG, GIF)
- Validate kích thước (max 5MB)
- Hiển thị số lượng playlist

### 3. Services API

#### api.js - Đã thêm
```javascript
// Playlist API
playlistAPI.getMyPlaylists()
playlistAPI.getPublicPlaylists()
playlistAPI.getPlaylistById(id)
playlistAPI.createPlaylist(data)
playlistAPI.updatePlaylist(id, data)
playlistAPI.deletePlaylist(id)
playlistAPI.addSongToPlaylist(playlistId, songId)
playlistAPI.removeSongFromPlaylist(playlistId, songId)
playlistAPI.reorderPlaylist(playlistId, songIds)

// User API - Thêm upload
userAPI.uploadAvatar(formData)
```

### 4. Routes
Đã thêm route mới trong App.jsx:
```javascript
<Route path="/playlists" element={
    <ProtectedRoute><PlaylistManager /></ProtectedRoute>
} />
```

---

## Database Migration

### File: `Database/add_playlist_tables.sql`

**Chạy script này trong SQL Server để tạo tables:**

```sql
-- Tạo bảng Playlists
CREATE TABLE Playlists (
    PlaylistID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    PlaylistName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(1000) NULL,
    IsPublic BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    CONSTRAINT FK_Playlists_Users FOREIGN KEY (UserID) 
        REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Tạo bảng PlaylistSongs
CREATE TABLE PlaylistSongs (
    PlaylistSongID INT IDENTITY(1,1) PRIMARY KEY,
    PlaylistID INT NOT NULL,
    SongID INT NOT NULL,
    OrderIndex INT NOT NULL,
    AddedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_PlaylistSongs_Playlists FOREIGN KEY (PlaylistID) 
        REFERENCES Playlists(PlaylistID) ON DELETE CASCADE,
    CONSTRAINT FK_PlaylistSongs_Songs FOREIGN KEY (SongID) 
        REFERENCES Songs(SongID) ON DELETE CASCADE
);

-- Tạo indexes
CREATE INDEX IX_Playlists_UserID ON Playlists(UserID);
CREATE INDEX IX_PlaylistSongs_PlaylistID ON PlaylistSongs(PlaylistID);
CREATE INDEX IX_PlaylistSongs_SongID ON PlaylistSongs(SongID);
```

---

## Hướng Dẫn Sử Dụng

### 1. Cài Đặt Database
```bash
# Kết nối SQL Server và chạy script
sqlcmd -S your_server -d your_database -i Database/add_playlist_tables.sql
```

### 2. Tạo Thư Mục Upload (Backend)
```bash
# Trong thư mục E-project.Net.Server
mkdir -p wwwroot/uploads/avatars
```

### 3. Build & Run Backend
```bash
cd E-project.Net.Server
dotnet build
dotnet run
```

### 4. Install & Run Frontend
```bash
cd e-project.net.client
npm install
npm run dev
```

---

## Tính Năng Chi Tiết

### Playlist Management
1. **Tạo Playlist**: Click "Create New Playlist" → Nhập tên, mô tả, chọn public/private
2. **Xem Playlist**: Click vào playlist trong danh sách
3. **Thêm Bài Hát**: Chọn playlist → Click "Add Song" → Chọn bài từ danh sách
4. **Xóa Bài**: Click "Remove" bên cạnh bài hát
5. **Xóa Playlist**: Click icon 🗑️ trên playlist
6. **Toggle Public/Private**: Click icon 🔒/🔓

### Profile & Avatar
1. **Xem Profile**: Truy cập `/profile`
2. **Upload Avatar**: Click "Chỉnh sửa" → "Chọn ảnh" → Chọn file → "Lưu"
3. **Cập nhật Họ Tên**: Click "Chỉnh sửa" → Nhập họ tên → "Lưu"

---

## API Authorization

Tất cả endpoints playlist yêu cầu JWT token:
```javascript
Authorization: Bearer <token>
```

**Quyền truy cập:**
- User chỉ thấy/chỉnh sửa playlist của mình
- Playlist public: Mọi người xem được
- Playlist private: Chỉ owner xem được

---

## Lưu Ý Quan Trọng

### Backend
1. **Static Files**: Cần configure `UseStaticFiles()` trong Program.cs để serve avatar images
2. **CORS**: Đảm bảo CORS được config cho upload files
3. **File Size Limit**: Mặc định 5MB, có thể tăng trong appsettings.json

### Frontend
1. **Avatar URL**: Cần prefix `/uploads/avatars/` cho relative paths
2. **Error Handling**: Đã có validation cho file type và size
3. **Loading States**: UI hiển thị trạng thái loading khi upload

### Database
1. **Cascade Delete**: Xóa user → xóa playlists → xóa playlist_songs
2. **OrderIndex**: Tự động tăng khi thêm bài, giảm khi xóa bài
3. **Indexes**: Đã tạo cho performance tốt hơn

---

## Testing Checklist

### Backend APIs
- [ ] Tạo playlist thành công
- [ ] Lấy danh sách playlist của user
- [ ] Thêm bài hát vào playlist
- [ ] Xóa bài hát khỏi playlist
- [ ] Xóa playlist
- [ ] Upload avatar thành công
- [ ] Validate file type/size
- [ ] Authorization: User không thể edit playlist của người khác

### Frontend
- [ ] UI hiển thị đúng danh sách playlist
- [ ] Modal tạo playlist hoạt động
- [ ] Thêm/xóa bài hát real-time update
- [ ] Toggle public/private
- [ ] Upload avatar + preview
- [ ] Error messages hiển thị đúng
- [ ] Loading states

---

## Next Steps (Tùy Chọn)

Các tính năng có thể mở rộng thêm:
1. **Drag & Drop** reorder songs trong playlist
2. **Share Playlist** qua link
3. **Playlist Cover Image**
4. **Like/Follow Playlist** của người khác
5. **Search trong Playlist**
6. **Export Playlist** (CSV, JSON)
7. **Playlist Statistics** (tổng thời lượng, số lượt nghe)
8. **Collaborative Playlist** (nhiều user cùng edit)

---

## Troubleshooting

### Lỗi thường gặp:

**1. "401 Unauthorized"**
- Kiểm tra JWT token trong localStorage
- Đảm bảo user đã login

**2. "404 Not Found" khi upload avatar**
- Kiểm tra folder `wwwroot/uploads/avatars` đã tồn tại
- Kiểm tra `UseStaticFiles()` trong Program.cs

**3. "Foreign Key Constraint" khi xóa user**
- Cascade delete đã được config, nhưng kiểm tra lại foreign keys

**4. Avatar không hiển thị**
- Kiểm tra path: `/uploads/avatars/filename.jpg`
- Kiểm tra static files middleware
- Kiểm tra file permissions

**5. Playlist không load**
- Kiểm tra database tables đã được tạo
- Kiểm tra DbContext có DbSet<Playlist> và DbSet<PlaylistSong>

---

## Contact & Support

Nếu gặp vấn đề, kiểm tra:
1. Console logs (F12) trong browser
2. Backend logs trong terminal
3. SQL Server error logs
4. Network tab để xem API responses

Chúc bạn triển khai thành công! 🎵🎉

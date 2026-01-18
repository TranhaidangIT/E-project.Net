-- Tạo Database
CREATE DATABASE MusicWebDB;
GO

USE MusicWebDB;
GO

-- Bảng Người dùng
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

-- Bảng Bài hát (đã loại bỏ foreign key tới Artists)
CREATE TABLE Songs (
    SongID INT PRIMARY KEY IDENTITY(1,1),
    SongName NVARCHAR(255) NOT NULL,
    ArtistName NVARCHAR(255) NOT NULL, -- Lưu tên nghệ sĩ trực tiếp
    Duration INT, -- giây
    PlayCount INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Bảng Playlist
CREATE TABLE Playlists (
    PlaylistID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    PlaylistName NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Bảng Bài hát trong Playlist
CREATE TABLE PlaylistSongs (
    PlaylistID INT NOT NULL,
    SongID INT NOT NULL,
    AddedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (PlaylistID, SongID),
    FOREIGN KEY (PlaylistID) REFERENCES Playlists(PlaylistID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES Songs(SongID) ON DELETE CASCADE
);

-- Bảng Lịch sử nghe
CREATE TABLE ListeningHistory (
    UserID INT NOT NULL,
    SongID INT NOT NULL,
    ListenedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES Songs(SongID) ON DELETE CASCADE
);

-- Bảng Yêu thích
CREATE TABLE Favorites (
    UserID INT NOT NULL,
    SongID INT NOT NULL,
    AddedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserID, SongID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES Songs(SongID) ON DELETE CASCADE
);

-- =============================================
-- DỮ LIỆU MẪU
-- =============================================

-- Insert Users
INSERT INTO Users (Username, Email, PasswordHash, FullName, IsAdmin) VALUES 
(N'admin', N'admin@musicweb.com', N'admin123', N'Admin', 1),
(N'user1', N'user1@gmail.com', N'user123', N'Nguyễn Văn A', 0);

-- Insert Songs (với tên nghệ sĩ trực tiếp)
INSERT INTO Songs (SongName, ArtistName, Duration) VALUES
(N'Bài hát mẫu 1', N'Sơn Tùng MTP', 240),
(N'Bài hát mẫu 2', N'Mỹ Tâm', 180);

-- Tạo Index
-- Bảng Token đặt lại mật khẩu
CREATE TABLE PasswordResetTokens (
    TokenID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Token NVARCHAR(255) NOT NULL UNIQUE,
    ExpiresAt DATETIME NOT NULL,
    IsUsed BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE INDEX IX_Songs_ArtistName ON Songs(ArtistName);
CREATE INDEX IX_ListeningHistory_UserID ON ListeningHistory(UserID);
CREATE INDEX IX_Favorites_UserID ON Favorites(UserID);
CREATE INDEX IX_PasswordResetTokens_Token ON PasswordResetTokens(Token);
CREATE INDEX IX_PasswordResetTokens_UserID ON PasswordResetTokens(UserID);

PRINT 'Database đã tạo thành công!';
PRINT 'Đã loại bỏ bảng Artists và chuyển sang lưu tên nghệ sĩ trực tiếp trong bảng Songs.';
GO
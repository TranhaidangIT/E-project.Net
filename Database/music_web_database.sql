-- ============================================
-- MASTER DATABASE SCRIPT: MusicWebDB
-- Gộp từ các file: music_web_database.sql, add_playlist_tables.sql, update_history.sql
-- ============================================

-- Tạo Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'MusicWebDB')
BEGIN
    CREATE DATABASE MusicWebDB;
END
GO

USE MusicWebDB;
GO

-- ============================================
-- 1. CLEANUP (Xóa bảng cũ theo thứ tự dependencies)
-- ============================================
DROP TABLE IF EXISTS PasswordResetTokens;
DROP TABLE IF EXISTS Favorites;
DROP TABLE IF EXISTS ListeningHistory;
DROP TABLE IF EXISTS PlaylistSongs;
DROP TABLE IF EXISTS Playlists;
DROP TABLE IF EXISTS Songs;
DROP TABLE IF EXISTS Users;
GO

-- ============================================
-- 2. CREATE TABLES
-- ============================================

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
GO

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
GO

-- Bảng Bài hát
CREATE TABLE Songs (
    SongID INT PRIMARY KEY IDENTITY(1,1),
    SongName NVARCHAR(255) NOT NULL,
    ArtistName NVARCHAR(255) NOT NULL,
    Duration INT, -- giây
    PlayCount INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Bảng Playlist (Schema mới - có Description, IsPublic, UpdatedAt)
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
GO

-- Bảng Bài hát trong Playlist (Schema mới - có OrderIndex, PlaylistSongID)
CREATE TABLE PlaylistSongs (
    PlaylistSongID INT IDENTITY(1,1) PRIMARY KEY,
    PlaylistID INT NOT NULL,
    SongID INT NOT NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    AddedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_PlaylistSongs_Playlists FOREIGN KEY (PlaylistID) 
        REFERENCES Playlists(PlaylistID) ON DELETE CASCADE,
    CONSTRAINT FK_PlaylistSongs_Songs FOREIGN KEY (SongID) 
        REFERENCES Songs(SongID) ON DELETE CASCADE
);
GO

-- Bảng Lịch sử nghe (Schema mới - có PK HistoryID)
CREATE TABLE ListeningHistory (
    HistoryID INT NOT NULL IDENTITY(1,1),
    UserID INT NOT NULL,
    SongID INT NOT NULL,
    ListenedAt DATETIME2 NOT NULL DEFAULT (GETDATE()),
    CONSTRAINT PK_ListeningHistory PRIMARY KEY (HistoryID),
    CONSTRAINT FK_ListeningHistory_Users_UserID FOREIGN KEY (UserID) REFERENCES Users (UserID) ON DELETE CASCADE,
    CONSTRAINT FK_ListeningHistory_Songs_SongID FOREIGN KEY (SongID) REFERENCES Songs (SongID) ON DELETE CASCADE
);
GO

-- Bảng Yêu thích (Giữ nguyên)
CREATE TABLE Favorites (
    UserID INT NOT NULL,
    SongID INT NOT NULL,
    AddedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserID, SongID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES Songs(SongID) ON DELETE CASCADE
);
GO

-- ============================================
-- 3. INDEXES
-- ============================================
CREATE INDEX IX_PasswordResetTokens_Token ON PasswordResetTokens(Token);
CREATE INDEX IX_PasswordResetTokens_UserID ON PasswordResetTokens(UserID);
CREATE INDEX IX_Songs_ArtistName ON Songs(ArtistName);
CREATE INDEX IX_Playlists_UserID ON Playlists(UserID);
CREATE INDEX IX_PlaylistSongs_PlaylistID ON PlaylistSongs(PlaylistID);
CREATE INDEX IX_PlaylistSongs_SongID ON PlaylistSongs(SongID);
CREATE INDEX IX_ListeningHistory_UserID ON ListeningHistory (UserID);
CREATE INDEX IX_ListeningHistory_SongID ON ListeningHistory (SongID);
CREATE INDEX IX_Favorites_UserID ON Favorites(UserID);
GO

-- ============================================
-- 4. DỮ LIỆU MẪU
-- ============================================

-- Insert Users
INSERT INTO Users (Username, Email, PasswordHash, FullName, IsAdmin) VALUES 
(N'admin', N'admin@musicweb.com', N'admin123', N'Admin', 1),
(N'user1', N'user1@gmail.com', N'user123', N'Nguyễn Văn A', 0);
GO

-- Insert Songs
INSERT INTO Songs (SongName, ArtistName, Duration) VALUES
(N'Bài hát mẫu 1', N'Sơn Tùng MTP', 240),
(N'Bài hát mẫu 2', N'Mỹ Tâm', 180);
GO

PRINT 'Database MusicWebDB đã được tạo mới hoàn toàn thành công!';
GO
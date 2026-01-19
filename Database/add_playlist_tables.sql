-- ============================================
-- Migration Script for Playlist Features
-- Copy và paste toàn bộ script này vào SQL Server Query
-- ============================================

USE MusicWebDB;
GO

-- Xóa bảng cũ nếu tồn tại (để script có thể chạy lại nhiều lần)
DROP TABLE IF EXISTS PlaylistSongs;
DROP TABLE IF EXISTS Playlists;
GO

-- ============================================
-- Tạo bảng Playlists
-- ============================================
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

-- Tạo index cho Playlists
CREATE INDEX IX_Playlists_UserID ON Playlists(UserID);
GO

-- ============================================
-- Tạo bảng PlaylistSongs (junction table)
-- ============================================
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

-- Tạo indexes cho PlaylistSongs
CREATE INDEX IX_PlaylistSongs_PlaylistID ON PlaylistSongs(PlaylistID);
CREATE INDEX IX_PlaylistSongs_SongID ON PlaylistSongs(SongID);
GO

-- ============================================
-- Kiểm tra kết quả
-- ============================================
PRINT '✓ Playlists table đã được tạo thành công';
PRINT '✓ PlaylistSongs table đã được tạo thành công';
PRINT '✓ Indexes đã được tạo thành công';
GO

-- Xem cấu trúc bảng vừa tạo
SELECT 
    TABLE_NAME AS 'Bảng',
    COLUMN_NAME AS 'Cột',
    DATA_TYPE AS 'Kiểu dữ liệu',
    IS_NULLABLE AS 'Nullable'
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('Playlists', 'PlaylistSongs')
ORDER BY TABLE_NAME, ORDINAL_POSITION;
GO

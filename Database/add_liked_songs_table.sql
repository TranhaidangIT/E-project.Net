-- Tạo bảng LikedSongs để lưu bài hát yêu thích của người dùng
USE music_web;
GO

-- Kiểm tra và tạo bảng nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[LikedSongs]') AND type in (N'U'))
BEGIN
    CREATE TABLE LikedSongs (
        LikedSongID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,
        SongID INT NOT NULL,
        LikedAt DATETIME DEFAULT GETDATE(),
        
        -- Foreign Keys
        CONSTRAINT FK_LikedSongs_Users FOREIGN KEY (UserID) 
            REFERENCES Users(UserID) ON DELETE CASCADE,
        CONSTRAINT FK_LikedSongs_Songs FOREIGN KEY (SongID) 
            REFERENCES Songs(SongID) ON DELETE CASCADE,
        
        -- Unique constraint: Mỗi user chỉ có thể thích 1 bài 1 lần
        CONSTRAINT UQ_LikedSongs_User_Song UNIQUE (UserID, SongID)
    );

    -- Indexes
    CREATE INDEX IX_LikedSongs_UserID ON LikedSongs(UserID);
    CREATE INDEX IX_LikedSongs_SongID ON LikedSongs(SongID);

    PRINT 'Table LikedSongs created successfully!';
END
ELSE
BEGIN
    PRINT 'Table LikedSongs already exists.';
END
GO

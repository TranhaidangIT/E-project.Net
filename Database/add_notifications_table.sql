-- Tạo bảng Notifications để lưu thông báo người dùng
USE music_web;
GO

-- Kiểm tra và tạo bảng nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
BEGIN
    CREATE TABLE Notifications (
        NotificationID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,                    -- Người nhận thông báo
        FromUserID INT NULL,                    -- Người gửi (nếu có)
        Type NVARCHAR(50) NOT NULL,             -- like, comment, share, system
        Title NVARCHAR(255) NOT NULL,
        Message NVARCHAR(1000) NOT NULL,
        Link NVARCHAR(500) NULL,                -- Link điều hướng
        RelatedID INT NULL,                     -- ID liên quan (song, playlist, comment...)
        IsRead BIT DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE(),
        
        -- Foreign Keys
        CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserID) 
            REFERENCES Users(UserID) ON DELETE CASCADE,
        CONSTRAINT FK_Notifications_FromUsers FOREIGN KEY (FromUserID) 
            REFERENCES Users(UserID) ON DELETE NO ACTION
    );

    -- Indexes
    CREATE INDEX IX_Notifications_UserID ON Notifications(UserID);
    CREATE INDEX IX_Notifications_FromUserID ON Notifications(FromUserID);
    CREATE INDEX IX_Notifications_IsRead ON Notifications(UserID, IsRead);
    CREATE INDEX IX_Notifications_CreatedAt ON Notifications(CreatedAt DESC);

    PRINT 'Table Notifications created successfully!';
END
ELSE
BEGIN
    PRINT 'Table Notifications already exists.';
END
GO

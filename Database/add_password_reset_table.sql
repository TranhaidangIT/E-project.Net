-- Thêm bảng PasswordResetTokens vào database MusicWebDB

USE MusicWebDB;
GO

-- Kiểm tra và xóa bảng nếu đã tồn tại
IF OBJECT_ID('dbo.PasswordResetTokens', 'U') IS NOT NULL
    DROP TABLE dbo.PasswordResetTokens;
GO

-- Tạo bảng mới
CREATE TABLE PasswordResetTokens (
    TokenID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Token NVARCHAR(255) NOT NULL UNIQUE,
    ExpiresAt DATETIME NOT NULL,
    IsUsed BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE INDEX IX_PasswordResetTokens_Token ON PasswordResetTokens(Token);
CREATE INDEX IX_PasswordResetTokens_UserID ON PasswordResetTokens(UserID);
GO

PRINT 'Bảng PasswordResetTokens đã được tạo thành công!';
GO

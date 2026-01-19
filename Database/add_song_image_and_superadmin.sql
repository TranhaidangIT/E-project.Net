-- Migration: Add ImageUrl to Songs and IsSuperAdmin to Users
-- Date: 2025
-- Description: 
--   1. Add ImageUrl column to Songs table for song cover images
--   2. Add IsSuperAdmin column to Users table for admin hierarchy

USE MusicDB;
GO

-- =====================================================
-- Add ImageUrl to Songs table
-- =====================================================
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Songs' AND COLUMN_NAME = 'ImageUrl'
)
BEGIN
    ALTER TABLE Songs ADD ImageUrl NVARCHAR(500) NULL;
    PRINT 'Added ImageUrl column to Songs table';
END
ELSE
BEGIN
    PRINT 'ImageUrl column already exists in Songs table';
END
GO

-- =====================================================
-- Add IsSuperAdmin to Users table
-- =====================================================
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'IsSuperAdmin'
)
BEGIN
    ALTER TABLE Users ADD IsSuperAdmin BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsSuperAdmin column to Users table';
END
ELSE
BEGIN
    PRINT 'IsSuperAdmin column already exists in Users table';
END
GO

-- =====================================================
-- Set the first admin as SuperAdmin (if exists)
-- =====================================================
UPDATE Users 
SET IsSuperAdmin = 1 
WHERE UserID = (
    SELECT TOP 1 UserID 
    FROM Users 
    WHERE IsAdmin = 1 
    ORDER BY CreatedAt ASC
);
PRINT 'Set first admin as SuperAdmin';
GO

-- =====================================================
-- Verify the changes
-- =====================================================
SELECT 'Songs Table Schema:' AS Info;
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Songs';

SELECT 'Users Table Schema:' AS Info;
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Users';

SELECT 'Current SuperAdmins:' AS Info;
SELECT UserID, Username, Email, IsAdmin, IsSuperAdmin 
FROM Users 
WHERE IsSuperAdmin = 1;
GO

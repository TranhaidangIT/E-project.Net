USE [MusicWebDB];
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ListeningHistory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ListeningHistory] (
        [HistoryID] int NOT NULL IDENTITY,
        [UserID] int NOT NULL,
        [SongID] int NOT NULL,
        [ListenedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
        CONSTRAINT [PK_ListeningHistory] PRIMARY KEY ([HistoryID]),
        CONSTRAINT [FK_ListeningHistory_Users_UserID] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE,
        CONSTRAINT [FK_ListeningHistory_Songs_SongID] FOREIGN KEY ([SongID]) REFERENCES [Songs] ([SongID]) ON DELETE CASCADE
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ListeningHistory_UserID' AND object_id = OBJECT_ID('ListeningHistory'))
BEGIN
    CREATE INDEX [IX_ListeningHistory_UserID] ON [ListeningHistory] ([UserID]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ListeningHistory_SongID' AND object_id = OBJECT_ID('ListeningHistory'))
BEGIN
    CREATE INDEX [IX_ListeningHistory_SongID] ON [ListeningHistory] ([SongID]);
END
GO

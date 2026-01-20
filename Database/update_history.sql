USE [MusicWebDB];
GO

CREATE TABLE [ListeningHistory] (
    [HistoryID] int NOT NULL IDENTITY,
    [UserID] int NOT NULL,
    [SongID] int NOT NULL,
    [ListenedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
    CONSTRAINT [PK_ListeningHistory] PRIMARY KEY ([HistoryID]),
    CONSTRAINT [FK_ListeningHistory_Users_UserID] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE,
    CONSTRAINT [FK_ListeningHistory_Songs_SongID] FOREIGN KEY ([SongID]) REFERENCES [Songs] ([SongID]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_ListeningHistory_UserID] ON [ListeningHistory] ([UserID]);
CREATE INDEX [IX_ListeningHistory_SongID] ON [ListeningHistory] ([SongID]);
GO

using Microsoft.EntityFrameworkCore;
using E_project.Net.Server.Models;

namespace E_project.Net.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<ListeningHistory> ListeningHistories { get; set; }
        public DbSet<PlaylistSong> PlaylistSongs { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.UserID);
                
                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(100);
                
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.Property(e => e.FullName)
                    .HasMaxLength(255);
                
                entity.Property(e => e.AvatarURL)
                    .HasMaxLength(500);
                
                entity.Property(e => e.IsAdmin)
                    .HasDefaultValue(false);
                
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

                // Unique constraints
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure PasswordResetToken entity
            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.ToTable("PasswordResetTokens");
                entity.HasKey(e => e.TokenID);
                
                entity.Property(e => e.Token)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.Property(e => e.IsUsed)
                    .HasDefaultValue(false);
                
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

                entity.HasIndex(e => e.Token)
                    .IsUnique()
                    .HasDatabaseName("IX_PasswordResetTokens_Token");
                
                entity.HasIndex(e => e.UserID)
                    .HasDatabaseName("IX_PasswordResetTokens_UserID");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Song entity
            modelBuilder.Entity<Song>(entity =>
            {
                entity.ToTable("Songs");
                entity.HasKey(e => e.SongID);
                
                entity.Property(e => e.SongName)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.Property(e => e.ArtistName)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.Property(e => e.PlayCount)
                    .HasDefaultValue(0);
                
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

                entity.HasIndex(e => e.ArtistName).HasDatabaseName("IX_Songs_ArtistName");
            });

            // Configure Playlist entity
            modelBuilder.Entity<Playlist>(entity =>
            {
                entity.ToTable("Playlists");
                entity.HasKey(e => e.PlaylistID);
                
                entity.Property(e => e.PlaylistName)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.Property(e => e.Description)
                    .HasMaxLength(1000);
                
                entity.Property(e => e.IsPublic)
                    .HasDefaultValue(false);
                
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.UserID).HasDatabaseName("IX_Playlists_UserID");
            });

            // Configure PlaylistSong entity
            modelBuilder.Entity<PlaylistSong>(entity =>
            {
                entity.ToTable("PlaylistSongs");
                entity.HasKey(e => e.PlaylistSongID);
                
                entity.Property(e => e.AddedAt)
                    .HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.Playlist)
                    .WithMany(p => p.PlaylistSongs)
                    .HasForeignKey(e => e.PlaylistID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Song)
                    .WithMany()
                    .HasForeignKey(e => e.SongID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.PlaylistID).HasDatabaseName("IX_PlaylistSongs_PlaylistID");
                entity.HasIndex(e => e.SongID).HasDatabaseName("IX_PlaylistSongs_SongID");
            });

            // Configure ListeningHistory entity
            modelBuilder.Entity<ListeningHistory>(entity =>
            {
                entity.ToTable("ListeningHistory");
                entity.HasKey(e => e.HistoryID);

                entity.Property(e => e.ListenedAt)
                    .HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Song)
                    .WithMany()
                    .HasForeignKey(e => e.SongID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.UserID).HasDatabaseName("IX_ListeningHistory_UserID");
                entity.HasIndex(e => e.SongID).HasDatabaseName("IX_ListeningHistory_SongID");
            });
        }
    }
}

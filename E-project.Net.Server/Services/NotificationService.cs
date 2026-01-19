using Microsoft.EntityFrameworkCore;
using E_project.Net.Server.Data;
using E_project.Net.Server.Models;

namespace E_project.Net.Server.Services
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(int userId, int? fromUserId, string type, string title, string message, string? link = null, int? relatedId = null);
        Task NotifyLikedSongAsync(int songOwnerId, int likerUserId, string songName);
        Task NotifyPlaylistSharedAsync(int recipientId, int sharerUserId, string playlistName, int playlistId);
        Task NotifySystemAsync(int userId, string title, string message, string? link = null);
        Task NotifyAllUsersAsync(string title, string message, string? link = null);
    }

    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(int userId, int? fromUserId, string type, string title, string message, string? link = null, int? relatedId = null)
        {
            // Không tự thông báo cho chính mình
            if (fromUserId.HasValue && fromUserId.Value == userId)
            {
                return;
            }

            var notification = new Notification
            {
                UserID = userId,
                FromUserID = fromUserId,
                Type = type,
                Title = title,
                Message = message,
                Link = link,
                RelatedID = relatedId,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task NotifyLikedSongAsync(int songOwnerId, int likerUserId, string songName)
        {
            var liker = await _context.Users.FindAsync(likerUserId);
            if (liker == null) return;

            await CreateNotificationAsync(
                userId: songOwnerId,
                fromUserId: likerUserId,
                type: "like",
                title: "Bài hát được thích",
                message: $"{liker.Username} đã thích bài hát \"{songName}\"",
                link: "/liked-songs"
            );
        }

        public async Task NotifyPlaylistSharedAsync(int recipientId, int sharerUserId, string playlistName, int playlistId)
        {
            var sharer = await _context.Users.FindAsync(sharerUserId);
            if (sharer == null) return;

            await CreateNotificationAsync(
                userId: recipientId,
                fromUserId: sharerUserId,
                type: "share",
                title: "Playlist được chia sẻ",
                message: $"{sharer.Username} đã chia sẻ playlist \"{playlistName}\" với bạn",
                link: $"/playlists?id={playlistId}",
                relatedId: playlistId
            );
        }

        public async Task NotifySystemAsync(int userId, string title, string message, string? link = null)
        {
            await CreateNotificationAsync(
                userId: userId,
                fromUserId: null,
                type: "system",
                title: title,
                message: message,
                link: link
            );
        }

        public async Task NotifyAllUsersAsync(string title, string message, string? link = null)
        {
            var userIds = await _context.Users.Select(u => u.UserID).ToListAsync();

            foreach (var userId in userIds)
            {
                await CreateNotificationAsync(
                    userId: userId,
                    fromUserId: null,
                    type: "system",
                    title: title,
                    message: message,
                    link: link
                );
            }
        }
    }
}

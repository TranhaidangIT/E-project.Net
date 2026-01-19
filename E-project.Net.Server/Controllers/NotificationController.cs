using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using E_project.Net.Server.Data;
using E_project.Net.Server.Models;
using E_project.Net.Server.Models.DTOs;
using System.Security.Claims;

namespace E_project.Net.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        /// <summary>
        /// Get all notifications for current user
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetNotifications([FromQuery] int limit = 20)
        {
            var userId = GetCurrentUserId();

            var notifications = await _context.Notifications
                .Where(n => n.UserID == userId)
                .Include(n => n.FromUser)
                .OrderByDescending(n => n.CreatedAt)
                .Take(limit)
                .Select(n => new NotificationDTO
                {
                    NotificationID = n.NotificationID,
                    Type = n.Type,
                    Title = n.Title,
                    Message = n.Message,
                    Link = n.Link,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt,
                    FromUsername = n.FromUser != null ? n.FromUser.Username : null,
                    FromAvatarURL = n.FromUser != null ? n.FromUser.AvatarURL : null
                })
                .ToListAsync();

            return Ok(notifications);
        }

        /// <summary>
        /// Get unread notification count
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            var userId = GetCurrentUserId();

            var count = await _context.Notifications
                .Where(n => n.UserID == userId && !n.IsRead)
                .CountAsync();

            return Ok(count);
        }

        /// <summary>
        /// Mark notification as read
        /// </summary>
        [HttpPut("{id}/read")]
        public async Task<ActionResult> MarkAsRead(int id)
        {
            var userId = GetCurrentUserId();

            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationID == id && n.UserID == userId);

            if (notification == null)
            {
                return NotFound(new { message = "Không tìm thấy thông báo" });
            }

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã đánh dấu đã đọc" });
        }

        /// <summary>
        /// Mark all notifications as read
        /// </summary>
        [HttpPut("read-all")]
        public async Task<ActionResult> MarkAllAsRead()
        {
            var userId = GetCurrentUserId();

            await _context.Notifications
                .Where(n => n.UserID == userId && !n.IsRead)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));

            return Ok(new { message = "Đã đánh dấu tất cả đã đọc" });
        }

        /// <summary>
        /// Delete a notification
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNotification(int id)
        {
            var userId = GetCurrentUserId();

            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationID == id && n.UserID == userId);

            if (notification == null)
            {
                return NotFound(new { message = "Không tìm thấy thông báo" });
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa thông báo" });
        }

        /// <summary>
        /// Delete all notifications
        /// </summary>
        [HttpDelete("clear-all")]
        public async Task<ActionResult> ClearAllNotifications()
        {
            var userId = GetCurrentUserId();

            await _context.Notifications
                .Where(n => n.UserID == userId)
                .ExecuteDeleteAsync();

            return Ok(new { message = "Đã xóa tất cả thông báo" });
        }
    }
}

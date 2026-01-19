namespace E_project.Net.Server.Models
{
    public class Notification
    {
        public int NotificationID { get; set; }
        public int UserID { get; set; }  // Người nhận thông báo
        public int? FromUserID { get; set; }  // Người gửi (nếu có)
        public string Type { get; set; } = string.Empty;  // like, comment, share, system
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Link { get; set; }  // Link điều hướng (nếu có)
        public int? RelatedID { get; set; }  // ID của bài hát, playlist, comment...
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public User? User { get; set; }
        public User? FromUser { get; set; }
    }
}

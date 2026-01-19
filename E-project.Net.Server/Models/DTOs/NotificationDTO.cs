namespace E_project.Net.Server.Models.DTOs
{
    public class NotificationDTO
    {
        public int NotificationID { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Link { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? FromUsername { get; set; }
        public string? FromAvatarURL { get; set; }
    }

    public class CreateNotificationDTO
    {
        public int UserID { get; set; }
        public int? FromUserID { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Link { get; set; }
        public int? RelatedID { get; set; }
    }
}

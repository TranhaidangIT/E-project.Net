namespace E_project.Net.Server.Models
{
    public class PasswordResetToken
    {
        public int TokenID { get; set; }
        public int UserID { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation property
        public User User { get; set; } = null!;
    }
}

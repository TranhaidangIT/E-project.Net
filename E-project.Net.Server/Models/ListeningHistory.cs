using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_project.Net.Server.Models
{
    public class ListeningHistory
    {
        [Key]
        public int HistoryID { get; set; }

        public int UserID { get; set; }
        public int SongID { get; set; }

        public DateTime ListenedAt { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual User User { get; set; }

        [ForeignKey("SongID")]
        public virtual Song Song { get; set; }
    }
}

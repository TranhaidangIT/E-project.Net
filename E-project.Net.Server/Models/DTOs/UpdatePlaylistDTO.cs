using System.ComponentModel.DataAnnotations;

namespace E_project.Net.Server.Models.DTOs
{
    public class UpdatePlaylistDTO
    {
        [MaxLength(255)]
        public string? PlaylistName { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public bool? IsPublic { get; set; }
    }
}

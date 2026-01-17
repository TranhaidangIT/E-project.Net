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
        }
    }
}

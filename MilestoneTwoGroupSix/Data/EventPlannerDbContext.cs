using Microsoft.EntityFrameworkCore;
using MilestoneTwoGroupSix.Models;
using System.Globalization;

namespace MilestoneTwoGroupSix.Data
{
    public class EventPlannerDbContext : DbContext
    {
        public EventPlannerDbContext(DbContextOptions<EventPlannerDbContext> options) : base(options) { }

        public DbSet<Event> Events { get; set; }
        public DbSet<Participant> Participants { get; set; }
        public DbSet<Sponsor> Sponsors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Sponsor>()
                .Property(s => s.Amount)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Event>()
                .HasMany(e => e.Participants)
                .WithOne(p => p.Event)
                .HasForeignKey(p => p.EventId);

            modelBuilder.Entity<Event>()
                .HasMany(e => e.Sponsors)
                .WithOne(s => s.Event)
                .HasForeignKey(s => s.EventId);

            // MIGHT REMOVE THIS LATER, THIS IS FOR AUTOMATIC CODE CREATION, NOT SURE IF WE WANT THIS
             modelBuilder.Entity<Event>()
                 .Property(e => e.Code)
                 .ValueGeneratedOnAdd(); // or some other logic for code generation

            modelBuilder.Entity<Participant>()
                .HasIndex(p => p.Email)
                .IsUnique();


        }
    }
}

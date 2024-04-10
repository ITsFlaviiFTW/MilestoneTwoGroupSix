namespace MilestoneTwoGroupSix.Models
{
    public class Sponsor
    {
        public int SponsorId { get; set; } // Primary key
        public string Name { get; set; }
        public decimal Amount { get; set; } // The amount sponsored
        public string Details { get; set; } // Additional details, could be branding requirements, etc.
        public int EventId { get; set; } // Foreign key referencing Event

        // Navigation property
        public Event Event { get; set; } // The event the sponsor is sponsoring
    }

}

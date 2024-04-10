namespace MilestoneTwoGroupSix.Models
{
    public class Participant
    {
        public int ParticipantId { get; set; } // Primary key
        public string Name { get; set; }
        public string Email { get; set; }
        public int EventId { get; set; } // Foreign key referencing Event

        // Navigation property
        public Event Event { get; set; } // The event the participant is attending
    }

}

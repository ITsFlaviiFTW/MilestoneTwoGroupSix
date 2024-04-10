namespace MilestoneTwoGroupSix.Models
{
    public class Event
    {
        public int EventId { get; set; } // Primary key
        public string Code { get; set; } // Unique code to find the event
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateTime { get; set; }
        public string Location { get; set; }

        // Navigation properties
        public List<Participant> Participants { get; set; } // Participants attending the event
        public List<Sponsor> Sponsors { get; set; } // Sponsors for the event
    }
}


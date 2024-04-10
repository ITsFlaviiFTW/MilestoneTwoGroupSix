namespace MilestoneTwoGroupSix.DTOs
{
    public class EventDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateTime { get; set; }
        public string Location { get; set; }
        // TODO: add eventId for code invitation feature
        // public int EventId { get; set; } 
        // Code can be used to retrieve the event if it's known to be unique
        public string Code { get; set; }
    }

}

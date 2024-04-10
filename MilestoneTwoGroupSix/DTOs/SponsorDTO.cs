namespace MilestoneTwoGroupSix.DTOs
{
    public class SponsorDTO
    {
        public string Name { get; set; }
        public decimal Amount { get; set; }
        // Details might include more complex objects or simple strings
        public string Details { get; set; }
        public int EventId { get; set; } // To associate the sponsor with an event
    }

}

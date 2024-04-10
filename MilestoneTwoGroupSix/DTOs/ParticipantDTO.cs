namespace MilestoneTwoGroupSix.DTOs
{
    public class ParticipantDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public int EventId { get; set; } // To associate the participant with an event
    }

}

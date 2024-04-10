using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MilestoneTwoGroupSix.Data;
using MilestoneTwoGroupSix.Models;
using MilestoneTwoGroupSix.DTOs;
using System.Linq;
using System.Threading.Tasks;


namespace MilestoneTwoGroupSix.Controllers
{
    [Route("api/participants")]
    [ApiController]
    public class ParticipantsController : ControllerBase
    {
        private readonly EventPlannerDbContext _context;

        public ParticipantsController(EventPlannerDbContext context)
        {
            _context = context;
        }

        // POST: api/participants
        // Register a participant to an event
        [HttpPost]
        public async Task<ActionResult<ParticipantDTO>> RegisterParticipant(ParticipantDTO participantDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var participant = new Participant
            {
                Name = participantDto.Name,
                Email = participantDto.Email,
                EventId = participantDto.EventId
            };

            _context.Participants.Add(participant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetParticipant", new { id = participant.ParticipantId }, participant);
        }

        // GET: api/participants/{id}
        // Get participant details by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ParticipantDTO>> GetParticipant(int id)
        {
            var participant = await _context.Participants.FindAsync(id);

            if (participant == null)
            {
                return NotFound();
            }

            var participantDto = new ParticipantDTO
            {
                Name = participant.Name,
                Email = participant.Email,
                EventId = participant.EventId
            };

            return participantDto;
        }

        // PUT: api/participants/{id}
        // Update participant details
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateParticipant(int id, ParticipantDTO participantDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var participant = await _context.Participants.FindAsync(id);
            if (participant == null)
            {
                return NotFound();
            }

            participant.Name = participantDto.Name;
            participant.Email = participantDto.Email;
            // Update other fields as necessary

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Participants.Any(e => e.ParticipantId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/participants/{id}
        // Cancel participant registration
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelRegistration(int id)
        {
            var participant = await _context.Participants.FindAsync(id);
            if (participant == null)
            {
                return NotFound();
            }

            _context.Participants.Remove(participant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }

}

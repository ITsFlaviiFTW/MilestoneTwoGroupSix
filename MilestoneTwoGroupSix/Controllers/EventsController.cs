using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MilestoneTwoGroupSix.Models;
using MilestoneTwoGroupSix.DTOs;
using MilestoneTwoGroupSix.Data;
using System.Linq;

namespace MilestoneTwoGroupSix.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly EventPlannerDbContext _context;

        public EventsController(EventPlannerDbContext context)
        {
            _context = context;
        }

        // GET: api/events
        // Get all events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDTO>>> GetEvents()
        {
            var events = await _context.Events
                .Select(e => new EventDTO
                {
                    Name = e.Name,
                    Description = e.Description,
                    DateTime = e.DateTime,
                    Location = e.Location,
                })
                .ToListAsync();

            return events;
        }

        // GET: api/events/{code}
        // Get an event by code
        [HttpGet("{code}")]
        public async Task<ActionResult<EventDTO>> GetEventByCode(string code)
        {
            var @event = await _context.Events
                .Where(e => e.Code == code)
                .Select(e => new EventDTO
                {
                    Name = e.Name,
                    Description = e.Description,
                    DateTime = e.DateTime,
                    Location = e.Location,
                })
                .FirstOrDefaultAsync();

            if (@event == null)
            {
                return NotFound();
            }

            return @event;
        }

        // POST: api/events
        // Create a new event
        [HttpPost]
        public async Task<ActionResult<EventDTO>> PostEvent(EventDTO eventDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var @event = new Event
            {
                Name = eventDto.Name,
                Description = eventDto.Description,
                DateTime = eventDto.DateTime,
                Location = eventDto.Location,
                Code = GenerateEventCode() // Server-generated code
            };

            _context.Events.Add(@event);
            await _context.SaveChangesAsync();

            // Create a new DTO to return, now including the Code.
            var createdEventDto = new EventResponseDTO
            {
                Name = @event.Name,
                Description = @event.Description,
                DateTime = @event.DateTime,
                Location = @event.Location,
                Code = @event.Code // Include the code in the response
            };

            // Use the generated code for the CreatedAtAction method
            return CreatedAtAction("GetEventByCode", new { code = @event.Code }, createdEventDto);
        }


        // DELETE: api/events/{code}
        // Delete an event by code
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeleteEvent(string code)
        {
            var @event = await _context.Events.FirstOrDefaultAsync(e => e.Code == code);
            if (@event == null)
            {
                return NotFound();
            }

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Helper method to generate a unique event code
        private string GenerateEventCode()
        {
            // TODO: Implement code generation logic here
            return Guid.NewGuid().ToString().Substring(0, 8); // Example logic
        }

        // GET: api/events/code/{code}
        [HttpGet("code/{code}")]
        public async Task<ActionResult> GetEventIdByCode(string code)
        {
            var @event = await _context.Events
                                        .Where(e => e.Code == code)
                                        .SingleOrDefaultAsync();

            if (@event == null)
            {
                return NotFound();
            }

            return Ok(new { eventId = @event.EventId });
        }


    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MilestoneTwoGroupSix.Data;
using MilestoneTwoGroupSix.DTOs;
using MilestoneTwoGroupSix.Models;
using System.Linq;
using System.Threading.Tasks;

namespace MilestoneTwoGroupSix.Controllers
{
    [Route("api/sponsors")]
    [ApiController]
    public class SponsorsController : ControllerBase
    {
        private readonly EventPlannerDbContext _context;

        public SponsorsController(EventPlannerDbContext context)
        {
            _context = context;
        }

        // POST: api/sponsors
        // Create a new sponsorship
        [HttpPost]
        public async Task<ActionResult<SponsorDTO>> CreateSponsorship(SponsorDTO sponsorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sponsor = new Sponsor
            {
                Name = sponsorDto.Name,
                Amount = sponsorDto.Amount,
                Details = sponsorDto.Details,
                EventId = sponsorDto.EventId
            };

            _context.Sponsors.Add(sponsor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSponsor", new { id = sponsor.SponsorId }, sponsor);
        }

        // GET: api/sponsors/{id}
        // Get sponsor details by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<SponsorDTO>> GetSponsor(int id)
        {
            var sponsor = await _context.Sponsors.FindAsync(id);

            if (sponsor == null)
            {
                return NotFound();
            }

            var sponsorDto = new SponsorDTO
            {
                Name = sponsor.Name,
                Amount = sponsor.Amount,
                Details = sponsor.Details,
                EventId = sponsor.EventId
            };

            return sponsorDto;
        }

        // PUT: api/sponsors/{id}
        // Update sponsorship details
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSponsorship(int id, SponsorDTO sponsorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sponsor = await _context.Sponsors.FindAsync(id);
            if (sponsor == null)
            {
                return NotFound();
            }

            sponsor.Name = sponsorDto.Name;
            sponsor.Amount = sponsorDto.Amount;
            sponsor.Details = sponsorDto.Details;
            // Assume EventId doesn't change; if it does, handle it appropriately

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Sponsors.Any(e => e.SponsorId == id))
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

        // DELETE: api/sponsors/{id}
        // Delete a sponsorship
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSponsorship(int id)
        {
            var sponsor = await _context.Sponsors.FindAsync(id);
            if (sponsor == null)
            {
                return NotFound();
            }

            _context.Sponsors.Remove(sponsor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }

}

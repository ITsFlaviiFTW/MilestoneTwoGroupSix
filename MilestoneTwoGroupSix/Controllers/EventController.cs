using Microsoft.AspNetCore.Mvc;

namespace MilestoneTwoGroupSix.Controllers
{
    public class EventController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

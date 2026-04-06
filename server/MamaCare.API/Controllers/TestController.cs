using Microsoft.AspNetCore.Mvc;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() =>
        Ok(new { message = "MamaCare API is running!", timestamp = DateTime.UtcNow });
}

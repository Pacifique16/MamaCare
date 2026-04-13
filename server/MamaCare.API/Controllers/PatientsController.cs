using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MamaCare.API.Services;

namespace MamaCare.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientsService _service;

    public PatientsController(IPatientsService service)
    {
        _service = service;
    }

    // GET /api/patients
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var patients = await _service.GetAllAsync();
        return Ok(patients);
    }

    // GET /api/patients/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var patient = await _service.GetByIdAsync(id);
        if (patient is null) return NotFound();
        return Ok(patient);
    }
}

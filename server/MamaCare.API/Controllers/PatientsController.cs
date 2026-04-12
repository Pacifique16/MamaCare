using Microsoft.AspNetCore.Mvc;
using MamaCare.API.Models;
using MamaCare.API.Services;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientsService _patientsService;

    public PatientsController(IPatientsService patientsService)
    {
        _patientsService = patientsService;
    }

    // GET /api/patients
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var patients = await _patientsService.GetAllAsync();
        return Ok(patients);
    }

    // GET /api/patients/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var patient = await _patientsService.GetByIdAsync(id);
        if (patient is null) return NotFound();
        return Ok(patient);
    }

    // POST /api/patients
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Patient patient)
    {
        var created = await _patientsService.CreateAsync(patient);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/patients/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Patient patient)
    {
        var updated = await _patientsService.UpdateAsync(id, patient);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    // DELETE /api/patients/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _patientsService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}

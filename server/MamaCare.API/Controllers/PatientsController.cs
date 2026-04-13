using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MamaCare.API.DTOs;
using MamaCare.API.Services;

namespace MamaCare.API.Controllers;

[Authorize(Roles = "Admin")]
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
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var patient = await _service.GetByIdAsync(id);
        if (patient is null) return NotFound();
        return Ok(patient);
    }

    // POST /api/patients
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PatientRequest request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/patients/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PatientRequest request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var updated = await _service.UpdateAsync(id, request);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    // DELETE /api/patients/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}

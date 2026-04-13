using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MamaCare.API.DTOs;
using MamaCare.API.Services;

namespace MamaCare.API.Controllers;

[Authorize]
[ApiController]
[Route("api/patient-appointments")]
public class PatientAppointmentsController : ControllerBase
{
    private readonly IPatientAppointmentsService _service;

    public PatientAppointmentsController(IPatientAppointmentsService service)
    {
        _service = service;
    }

    // GET /api/patient-appointments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var appointments = await _service.GetAllAsync();
        return Ok(appointments);
    }

    // GET /api/patient-appointments/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var appointment = await _service.GetByIdAsync(id);
        if (appointment is null) return NotFound();
        return Ok(appointment);
    }

    // GET /api/patient-appointments/patient/{patientId}
    [HttpGet("patient/{patientId:int}")]
    public async Task<IActionResult> GetByPatientId(int patientId)
    {
        var appointments = await _service.GetByPatientIdAsync(patientId);
        return Ok(appointments);
    }

    // GET /api/patient-appointments/doctors
    [HttpGet("doctors")]
    public async Task<IActionResult> GetVerifiedDoctors()
    {
        var doctors = await _service.GetVerifiedDoctorsAsync();
        return Ok(doctors);
    }

    // GET /api/patient-appointments/doctors/{doctorId}/slots?date=2026-04-15&exclude=3
    [HttpGet("doctors/{doctorId:int}/slots")]
    public async Task<IActionResult> GetAvailableSlots(int doctorId, [FromQuery] DateOnly date, [FromQuery] int? exclude = null)
    {
        var slots = await _service.GetAvailableSlotsAsync(doctorId, date, exclude);
        return Ok(slots);
    }

    // POST /api/patient-appointments
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PatientAppointmentRequest request)
    {
        var (result, error) = await _service.CreateAsync(request);
        if (error is not null) return Conflict(new { message = error });
        return CreatedAtAction(nameof(GetById), new { id = result!.Id }, result);
    }

    // PUT /api/patient-appointments/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PatientAppointmentRequest request)
    {
        var (result, error) = await _service.UpdateAsync(id, request);
        if (error is not null) return Conflict(new { message = error });
        if (result is null) return NotFound();
        return Ok(result);
    }

    // DELETE /api/patient-appointments/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}

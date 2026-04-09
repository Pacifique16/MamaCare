using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VitalsController : ControllerBase
{
    private readonly AppDbContext _db;
    public VitalsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? motherId)
    {
        var query = _db.VitalRecords.AsQueryable();
        if (motherId.HasValue) query = query.Where(v => v.MotherId == motherId);

        var result = await query
            .OrderByDescending(v => v.RecordedAt)
            .Select(v => new VitalRecordDto(
                v.Id, v.MotherId, v.BloodPressureSystolic, v.BloodPressureDiastolic,
                v.WeightKg, v.FetalHeartRate, v.Temperature, v.RecordedAt, v.Notes))
            .ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateVitalRecordDto dto)
    {
        var record = new VitalRecord
        {
            MotherId = dto.MotherId,
            BloodPressureSystolic = dto.BloodPressureSystolic,
            BloodPressureDiastolic = dto.BloodPressureDiastolic,
            WeightKg = dto.WeightKg,
            FetalHeartRate = dto.FetalHeartRate,
            Temperature = dto.Temperature,
            Notes = dto.Notes
        };
        _db.VitalRecords.Add(record);
        await _db.SaveChangesAsync();
        return Ok(record);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var record = await _db.VitalRecords.FindAsync(id);
        if (record is null) return NotFound();
        _db.VitalRecords.Remove(record);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

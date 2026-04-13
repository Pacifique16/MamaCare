using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Services;

public class PatientsService : IPatientsService
{
    private readonly AppDbContext _db;

    public PatientsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Patient>> GetAllAsync()
    {
        return await _db.Patients
            .OrderBy(p => p.FullName)
            .ToListAsync();
    }

    public async Task<Patient?> GetByIdAsync(int id)
    {
        return await _db.Patients.FindAsync(id);
    }

    public async Task<Patient> CreateAsync(PatientRequest request)
    {
        var patient = new Patient
        {
            FullName       = request.FullName.Trim(),
            DateOfBirth    = DateTime.SpecifyKind(request.DateOfBirth, DateTimeKind.Utc),
            PhoneNumber    = request.PhoneNumber?.Trim(),
            Address        = request.Address?.Trim(),
            WeeksPregnant  = request.WeeksPregnant,
            CreatedAt      = DateTime.UtcNow,
        };

        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();
        return patient;
    }

    public async Task<Patient?> UpdateAsync(int id, PatientRequest request)
    {
        var patient = await _db.Patients.FindAsync(id);
        if (patient is null) return null;

        patient.FullName      = request.FullName.Trim();
        patient.DateOfBirth   = DateTime.SpecifyKind(request.DateOfBirth, DateTimeKind.Utc);
        patient.PhoneNumber   = request.PhoneNumber?.Trim();
        patient.Address       = request.Address?.Trim();
        patient.WeeksPregnant = request.WeeksPregnant;

        await _db.SaveChangesAsync();
        return patient;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var patient = await _db.Patients.FindAsync(id);
        if (patient is null) return false;

        _db.Patients.Remove(patient);
        await _db.SaveChangesAsync();
        return true;
    }
}

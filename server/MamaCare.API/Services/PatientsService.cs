using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
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

    public async Task<Patient> CreateAsync(Patient patient)
    {
        patient.CreatedAt = DateTime.UtcNow;
        patient.DateOfBirth = DateTime.SpecifyKind(patient.DateOfBirth, DateTimeKind.Utc);
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();
        return patient;
    }

    public async Task<Patient?> UpdateAsync(int id, Patient incoming)
    {
        var patient = await _db.Patients.FindAsync(id);
        if (patient is null) return null;

        patient.FullName = incoming.FullName;
        patient.DateOfBirth = DateTime.SpecifyKind(incoming.DateOfBirth, DateTimeKind.Utc);
        patient.PhoneNumber = incoming.PhoneNumber;
        patient.Address = incoming.Address;
        patient.WeeksPregnant = incoming.WeeksPregnant;

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

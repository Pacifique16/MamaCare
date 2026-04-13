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
        => await _db.Patients.OrderBy(p => p.FullName).ToListAsync();

    public async Task<Patient?> GetByIdAsync(int id)
        => await _db.Patients.FindAsync(id);
}

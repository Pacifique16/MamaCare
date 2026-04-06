using Microsoft.EntityFrameworkCore;
using MamaCare.API.Models;

namespace MamaCare.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Mother> Mothers => Set<Mother>();
}

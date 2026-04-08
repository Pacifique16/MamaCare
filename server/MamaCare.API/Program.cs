using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using MamaCare.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Use PORT env variable for Render deployment
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Allow local dev + production frontend (update FRONTEND_URL on Render)
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "";
var allowedOrigins = new List<string>
{
    "http://localhost:5173",
    "http://localhost:5174",
};
if (!string.IsNullOrEmpty(frontendUrl))
    allowedOrigins.Add(frontendUrl);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();

app.Run();

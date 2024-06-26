using Microsoft.EntityFrameworkCore;
using MilestoneTwoGroupSix.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the DbContext with dependency injection.
builder.Services.AddDbContext<EventPlannerDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Use default files (needed for index.html)
app.UseDefaultFiles();

// Use static files
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors("AllowAll"); // Use the CORS policy
app.UseAuthorization();
app.MapControllers();
app.Run();

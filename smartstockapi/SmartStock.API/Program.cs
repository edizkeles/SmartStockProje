using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using SmartStock.Business.Services;
using SmartStock.DataAccess.Context;
using SmartStock.DataAccess.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUrunRepository, UrunRepository>();
builder.Services.AddScoped<IUrunService, UrunService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    // Create UrunIslemHareketleri table if not exists using Raw SQL to preserve existing database data
    using (var command = context.Database.GetDbConnection().CreateCommand())
    {
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS ""UrunIslemHareketleri"" (
                ""Id"" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                ""Username"" TEXT NULL,
                ""ProductName"" TEXT NULL,
                ""ActionType"" TEXT NULL,
                ""Details"" TEXT NULL,
                ""Timestamp"" TEXT NULL
            );";
        context.Database.OpenConnection();
        command.ExecuteNonQuery();
    }
}

app.MapControllers();

app.Run();

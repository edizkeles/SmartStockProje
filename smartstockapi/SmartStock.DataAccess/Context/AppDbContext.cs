using Microsoft.EntityFrameworkCore;
using SmartStock.Entity.Concrete;

namespace SmartStock.DataAccess.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Urun> Urunler { get; set; }
        public DbSet<ElektronikUrun> ElektronikUrunler { get; set; }
        public DbSet<GidaUrun> GidaUrunler { get; set; }
        public DbSet<Kategori> Kategoriler { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Urun>()
                .HasDiscriminator<string>("UrunTuru")
                .HasValue<ElektronikUrun>("Elektronik")
                .HasValue<GidaUrun>("Gida");

            modelBuilder.Entity<Kategori>().HasData(
                new Kategori { Id = 1, Ad = "Elektronik" },
                new Kategori { Id = 2, Ad = "Gida" },
                new Kategori { Id = 3, Ad = "Kozmetik" },
                new Kategori { Id = 4, Ad = "Kirtasiye" }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}

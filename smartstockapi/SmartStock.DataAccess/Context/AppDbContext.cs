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
        public DbSet<Kullanici> Kullanicilar { get; set; }
        public DbSet<SatisHareketi> SatisHareketleri { get; set; }
        public DbSet<StokAlimHareketi> StokAlimHareketleri { get; set; }
        public DbSet<UrunIslemHareketi> UrunIslemHareketleri { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Urun>()
                .HasDiscriminator<string>("UrunTuru")
                .HasValue<ElektronikUrun>("Elektronik")
                .HasValue<GidaUrun>("Gida");

            // Seed Categories
            modelBuilder.Entity<Kategori>().HasData(
                new Kategori { Id = 1, Ad = "Elektronik" },
                new Kategori { Id = 2, Ad = "Gida" },
                new Kategori { Id = 3, Ad = "Kozmetik" },
                new Kategori { Id = 4, Ad = "Kirtasiye" }
            );

            // Seed Default Users
            modelBuilder.Entity<Kullanici>().HasData(
                new Kullanici { Id = 1, Username = "admin", Password = "admin123", Role = "admin" },
                new Kullanici { Id = 2, Username = "musteri", Password = "musteri123", Role = "customer" }
            );

            // Seed Sample Products
            modelBuilder.Entity<ElektronikUrun>().HasData(
                new ElektronikUrun { Id = 1, Ad = "Akıllı Telefon", Barkod = "1234567890", KategoriId = 1, StokMiktari = 15, Fiyat = 12000m, Agirlik = 0.2 },
                new ElektronikUrun { Id = 2, Ad = "Laptop", Barkod = "0987654321", KategoriId = 1, StokMiktari = 8, Fiyat = 24000m, Agirlik = 1.6 }
            );

            modelBuilder.Entity<GidaUrun>().HasData(
                new GidaUrun { Id = 3, Ad = "Ekmek", Barkod = "111222333", KategoriId = 2, StokMiktari = 40, Fiyat = 8m, Agirlik = 0.25 },
                new GidaUrun { Id = 4, Ad = "Süt", Barkod = "444555666", KategoriId = 2, StokMiktari = 30, Fiyat = 22m, Agirlik = 1.0 }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}

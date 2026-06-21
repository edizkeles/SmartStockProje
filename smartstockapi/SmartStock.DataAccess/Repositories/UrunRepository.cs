using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartStock.DataAccess.Context;
using SmartStock.Entity.Concrete;

namespace SmartStock.DataAccess.Repositories
{
    public class UrunRepository : IUrunRepository
    {
        private readonly AppDbContext _context;

        public UrunRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Urun>> GetAllAsync()
        {
            return await _context.Urunler.Include(u => u.Kategori).ToListAsync();
        }

        public async Task<Urun> GetByIdAsync(int id)
        {
            return await _context.Urunler.Include(u => u.Kategori).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task AddAsync(Urun urun)
        {
            await _context.Urunler.AddAsync(urun);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Urun urun)
        {
            _context.Urunler.Update(urun);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var urun = await GetByIdAsync(id);
            if (urun != null)
            {
                _context.Urunler.Remove(urun);
                await _context.SaveChangesAsync();
            }
        }
    }
}

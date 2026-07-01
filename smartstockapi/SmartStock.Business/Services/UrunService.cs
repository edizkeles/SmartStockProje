using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartStock.DataAccess.Repositories;
using SmartStock.Entity.Concrete;

namespace SmartStock.Business.Services
{
    public class UrunService : IUrunService
    {
        private readonly IUrunRepository _urunRepository;

        public UrunService(IUrunRepository urunRepository)
        {
            _urunRepository = urunRepository;
        }

        public async Task<IEnumerable<Urun>> GetAllAsync()
        {
            return await _urunRepository.GetAllAsync();
        }

        public async Task<Urun> GetByIdAsync(int id)
        {
            return await _urunRepository.GetByIdAsync(id);
        }

        public async Task AddAsync(Urun urun)
        {
            await _urunRepository.AddAsync(urun);
        }

        public async Task UpdateAsync(Urun urun)
        {
            await _urunRepository.UpdateAsync(urun);
        }

        public async Task DeleteAsync(int id)
        {
            await _urunRepository.DeleteAsync(id);
        }

        public async Task StokGuncelleAsync(int id, double yeniStok)
        {
            if (yeniStok < 0)
            {
                throw new ArgumentException("Stok miktari negatif olamaz.");
            }
            var urun = await _urunRepository.GetByIdAsync(id);
            if (urun != null)
            {
                urun.StokMiktari = yeniStok;
                await _urunRepository.UpdateAsync(urun);
            }
        }
    }
}

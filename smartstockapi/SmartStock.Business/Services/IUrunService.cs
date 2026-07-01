using System.Collections.Generic;
using System.Threading.Tasks;
using SmartStock.Entity.Concrete;

namespace SmartStock.Business.Services
{
    public interface IUrunService
    {
        Task<IEnumerable<Urun>> GetAllAsync();
        Task<Urun> GetByIdAsync(int id);
        Task AddAsync(Urun urun);
        Task UpdateAsync(Urun urun);
        Task DeleteAsync(int id);
        Task StokGuncelleAsync(int id, double yeniStok);
    }
}

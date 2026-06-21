using System.Collections.Generic;
using System.Threading.Tasks;
using SmartStock.Entity.Concrete;

namespace SmartStock.DataAccess.Repositories
{
    public interface IUrunRepository
    {
        Task<IEnumerable<Urun>> GetAllAsync();
        Task<Urun> GetByIdAsync(int id);
        Task AddAsync(Urun urun);
        Task UpdateAsync(Urun urun);
        Task DeleteAsync(int id);
    }
}

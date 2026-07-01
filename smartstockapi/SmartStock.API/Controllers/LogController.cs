using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStock.DataAccess.Context;
using SmartStock.Entity.Concrete;

namespace SmartStock.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LogController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            var salesList = await _context.SatisHareketleri
                .ToListAsync();

            var stockUpdates = await _context.StokAlimHareketleri
                .ToListAsync();

            var productMutations = await _context.UrunIslemHareketleri
                .ToListAsync();

            // Map and merge logs
            var logsList = new List<object>();

            var groupedSales = salesList
                .GroupBy(s => new { s.Username, s.Timestamp })
                .ToList();

            foreach (var group in groupedSales)
            {
                var firstItem = group.First();
                var totalPrice = group.Sum(g => g.TotalItemPrice);

                logsList.Add(new
                {
                    id = "purchase_" + firstItem.Id,
                    type = "purchase",
                    username = group.Key.Username,
                    timestamp = group.Key.Timestamp,
                    totalPrice = totalPrice,
                    items = group.Select(i => new
                    {
                        productId = i.ProductId,
                        ad = i.Ad,
                        quantity = i.Quantity,
                        pricePerUnit = i.PricePerUnit,
                        totalItemPrice = i.TotalItemPrice,
                        isWeightBased = i.IsWeightBased
                    }).ToList(),
                    // for backend sorting
                    createdAt = ParseTimestamp(group.Key.Timestamp)
                });
            }

            foreach (var update in stockUpdates)
            {
                logsList.Add(new
                {
                    id = "stock_update_" + update.Id,
                    type = "stock_update",
                    username = update.Username,
                    timestamp = update.Timestamp,
                    productName = update.ProductName,
                    oldStock = update.OldStock,
                    newStock = update.NewStock,
                    unit = update.Unit,
                    // for backend sorting
                    createdAt = ParseTimestamp(update.Timestamp)
                });
            }

            foreach (var pm in productMutations)
            {
                logsList.Add(new
                {
                    id = "product_mutate_" + pm.Id,
                    type = "product_mutate",
                    username = pm.Username,
                    timestamp = pm.Timestamp,
                    productName = pm.ProductName,
                    actionType = pm.ActionType,
                    details = pm.Details,
                    // for backend sorting
                    createdAt = ParseTimestamp(pm.Timestamp)
                });
            }

            // Sort by date descending
            var sortedLogs = logsList
                .OrderByDescending(x => (DateTime)x.GetType().GetProperty("createdAt").GetValue(x, null))
                .Select(x => {
                    // Remove temporary createdAt property for clean JSON
                    var p = x.GetType().GetProperties();
                    var dict = p.ToDictionary(prop => prop.Name, prop => prop.GetValue(x, null));
                    dict.Remove("createdAt");
                    return dict;
                })
                .ToList();

            return Ok(sortedLogs);
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> AddPurchaseLog([FromBody] SatisHareketiDto dto)
        {
            if (dto == null || dto.Items == null || !dto.Items.Any())
            {
                return BadRequest("Geçersiz sipariş bilgisi.");
            }

            var timestamp = DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss");

            foreach (var itemDto in dto.Items)
            {
                var sale = new SatisHareketi
                {
                    Username = dto.Username,
                    Timestamp = timestamp,
                    ProductId = itemDto.ProductId,
                    Ad = itemDto.Ad,
                    Quantity = itemDto.Quantity,
                    PricePerUnit = itemDto.PricePerUnit,
                    TotalItemPrice = itemDto.TotalItemPrice,
                    IsWeightBased = itemDto.IsWeightBased
                };
                await _context.SatisHareketleri.AddAsync(sale);
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        [HttpPost("stock-update")]
        public async Task<IActionResult> AddStockUpdateLog([FromBody] StokAlimHareketiDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.ProductName))
            {
                return BadRequest("Geçersiz stok güncelleme bilgisi.");
            }

            var update = new StokAlimHareketi
            {
                Username = dto.Username,
                ProductName = dto.ProductName,
                OldStock = dto.OldStock,
                NewStock = dto.NewStock,
                Unit = dto.Unit,
                Timestamp = DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss")
            };

            await _context.StokAlimHareketleri.AddAsync(update);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        [HttpPost("product-mutation")]
        public async Task<IActionResult> AddProductMutationLog([FromBody] UrunIslemHareketiDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.ProductName))
            {
                return BadRequest("Geçersiz ürün hareket bilgisi.");
            }

            var pm = new UrunIslemHareketi
            {
                Username = dto.Username,
                ProductName = dto.ProductName,
                ActionType = dto.ActionType,
                Details = dto.Details,
                Timestamp = DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss")
            };

            await _context.UrunIslemHareketleri.AddAsync(pm);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        [HttpDelete]
        public async Task<IActionResult> ClearLogs()
        {
            _context.SatisHareketleri.RemoveRange(_context.SatisHareketleri);
            _context.StokAlimHareketleri.RemoveRange(_context.StokAlimHareketleri);
            _context.UrunIslemHareketleri.RemoveRange(_context.UrunIslemHareketleri);

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        private DateTime ParseTimestamp(string timestamp)
        {
            if (DateTime.TryParseExact(timestamp, "dd.MM.yyyy HH:mm:ss", null, System.Globalization.DateTimeStyles.None, out DateTime dt))
            {
                return dt;
            }
            return DateTime.MinValue;
        }
    }

    public class SatisHareketiDto
    {
        public string Username { get; set; }
        public decimal TotalPrice { get; set; }
        public List<SatisHareketiUrunDto> Items { get; set; }
    }

    public class SatisHareketiUrunDto
    {
        public int ProductId { get; set; }
        public string Ad { get; set; }
        public double Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalItemPrice { get; set; }
        public bool IsWeightBased { get; set; }
    }

    public class StokAlimHareketiDto
    {
        public string Username { get; set; }
        public string ProductName { get; set; }
        public double OldStock { get; set; }
        public double NewStock { get; set; }
        public string Unit { get; set; }
    }

    public class UrunIslemHareketiDto
    {
        public string Username { get; set; }
        public string ProductName { get; set; }
        public string ActionType { get; set; }
        public string Details { get; set; }
    }
}

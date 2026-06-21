using System;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SmartStock.Business.Services;
using SmartStock.Entity.Concrete;
using SmartStock.API.Factory;

namespace SmartStock.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UrunController : ControllerBase
    {
        private readonly IUrunService _urunService;

        public UrunController(IUrunService urunService)
        {
            _urunService = urunService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var urunler = await _urunService.GetAllAsync();
            return Ok(urunler);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var urun = await _urunService.GetByIdAsync(id);
            if (urun == null)
            {
                return NotFound();
            }
            return Ok(urun);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UrunCreateOrUpdateDto dto)
        {
            try
            {
                Urun urun = UrunFactory.CreateUrun(dto.UrunTipi);

                urun.Ad = dto.Ad;
                urun.Barkod = dto.Barkod;
                urun.StokMiktari = dto.StokMiktari;
                urun.Fiyat = dto.Fiyat;
                urun.Agirlik = dto.Agirlik;
                urun.KategoriId = dto.KategoriId;

                await _urunService.AddAsync(urun);
                return CreatedAtAction(nameof(GetById), new { id = urun.Id }, urun);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UrunCreateOrUpdateDto dto)
        {
            try
            {
                var existingUrun = await _urunService.GetByIdAsync(id);
                if (existingUrun == null)
                {
                    return NotFound();
                }

                existingUrun.Ad = dto.Ad;
                existingUrun.Barkod = dto.Barkod;
                existingUrun.StokMiktari = dto.StokMiktari;
                existingUrun.Fiyat = dto.Fiyat;
                existingUrun.Agirlik = dto.Agirlik;
                existingUrun.KategoriId = dto.KategoriId;

                await _urunService.UpdateAsync(existingUrun);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingUrun = await _urunService.GetByIdAsync(id);
            if (existingUrun == null)
            {
                return NotFound();
            }
            await _urunService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("{id}/stok-guncelle")]
        public async Task<IActionResult> StokGuncelle(int id, [FromBody] StokGuncelleDto dto)
        {
            try
            {
                await _urunService.StokGuncelleAsync(id, dto.YeniStok);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class UrunCreateOrUpdateDto
    {
        [JsonPropertyName("ad")]
        public string Ad { get; set; }

        [JsonPropertyName("barkod")]
        public string Barkod { get; set; }

        [JsonPropertyName("stok_miktari")]
        public double StokMiktari { get; set; }

        [JsonPropertyName("fiyat")]
        public decimal Fiyat { get; set; }

        [JsonPropertyName("agirlik")]
        public double Agirlik { get; set; }

        [JsonPropertyName("kategori_id")]
        public int KategoriId { get; set; }

        [JsonPropertyName("urun_tipi")]
        public string UrunTipi { get; set; }
    }

    public class StokGuncelleDto
    {
        [JsonPropertyName("yeni_stok")]
        public double YeniStok { get; set; }
    }
}

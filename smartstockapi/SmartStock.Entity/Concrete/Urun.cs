using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartStock.Entity.Concrete
{
    public class Urun
    {
        private decimal _fiyat;
        private double _stokMiktari;
        private double _agirlik;

        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("ad")]
        public string Ad { get; set; }

        [JsonPropertyName("barkod")]
        public string Barkod { get; set; }

        [JsonPropertyName("kategori_id")]
        public int KategoriId { get; set; }

        [JsonPropertyName("kategori")]
        public Kategori Kategori { get; set; }

        [JsonPropertyName("stok_miktari")]
        public double StokMiktari
        {
            get => _stokMiktari;
            set
            {
                if (value < 0)
                {
                    throw new ArgumentException("Stok miktari negatif olamaz.");
                }
                _stokMiktari = value;
            }
        }

        [JsonPropertyName("fiyat")]
        public decimal Fiyat
        {
            get => _fiyat;
            set
            {
                if (value < 0)
                {
                    throw new ArgumentException("Fiyat negatif olamaz.");
                }
                _fiyat = value;
            }
        }

        [JsonPropertyName("agirlik")]
        public double Agirlik
        {
            get => _agirlik;
            set
            {
                if (value < 0)
                {
                    throw new ArgumentException("Agirlik negatif olamaz.");
                }
                _agirlik = value;
            }
        }

        [NotMapped]
        [JsonPropertyName("urun_tipi")]
        public string UrunTipi => GetType().Name.Contains("Elektronik") ? "Elektronik" : "Gida";

        [NotMapped]
        [JsonPropertyName("kdv")]
        public decimal Kdv => HesaplaKDV();

        [NotMapped]
        [JsonPropertyName("kdvli_fiyat")]
        public decimal KdvliFiyat => Fiyat + HesaplaKDV();

        public virtual decimal HesaplaKDV()
        {
            return 0;
        }
    }
}

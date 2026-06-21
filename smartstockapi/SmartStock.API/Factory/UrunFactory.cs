using SmartStock.Entity.Concrete;

namespace SmartStock.API.Factory
{
    public static class UrunFactory
    {
        public static Urun CreateUrun(string urunTipi)
        {
            return urunTipi switch
            {
                "Elektronik" => new ElektronikUrun(),
                "Gida" => new GidaUrun(),
                _ => throw new System.ArgumentException("Gecersiz urun tipi.")
            };
        }
    }
}

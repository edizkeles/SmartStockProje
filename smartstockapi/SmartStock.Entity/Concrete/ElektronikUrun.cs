using System;

namespace SmartStock.Entity.Concrete
{
    public class ElektronikUrun : Urun
    {
        public override decimal HesaplaKDV()
        {
            return Fiyat * 0.20m;
        }
    }
}

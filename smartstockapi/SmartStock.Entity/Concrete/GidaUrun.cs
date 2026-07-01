using System;

namespace SmartStock.Entity.Concrete
{
    public class GidaUrun : Urun
    {
        public override decimal HesaplaKDV()
        {
            return Fiyat * 0.01m;
        }
    }
}

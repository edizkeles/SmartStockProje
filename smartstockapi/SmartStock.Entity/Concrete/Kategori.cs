using System;
using System.Text.Json.Serialization;

namespace SmartStock.Entity.Concrete
{
    public class Kategori
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("ad")]
        public string Ad { get; set; }
    }
}

using System;
using System.Text.Json.Serialization;

namespace SmartStock.Entity.Concrete
{
    public class SatisHareketi
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("username")]
        public string Username { get; set; }

        [JsonPropertyName("timestamp")]
        public string Timestamp { get; set; }

        [JsonPropertyName("product_id")]
        public int ProductId { get; set; }

        [JsonPropertyName("ad")]
        public string Ad { get; set; }

        [JsonPropertyName("quantity")]
        public double Quantity { get; set; }

        [JsonPropertyName("price_per_unit")]
        public decimal PricePerUnit { get; set; }

        [JsonPropertyName("total_item_price")]
        public decimal TotalItemPrice { get; set; }

        [JsonPropertyName("is_weight_based")]
        public bool IsWeightBased { get; set; }
    }
}

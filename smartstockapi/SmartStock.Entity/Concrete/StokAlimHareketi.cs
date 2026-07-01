using System.Text.Json.Serialization;

namespace SmartStock.Entity.Concrete
{
    public class StokAlimHareketi
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("username")]
        public string Username { get; set; }

        [JsonPropertyName("product_name")]
        public string ProductName { get; set; }

        [JsonPropertyName("old_stock")]
        public double OldStock { get; set; }

        [JsonPropertyName("new_stock")]
        public double NewStock { get; set; }

        [JsonPropertyName("unit")]
        public string Unit { get; set; }

        [JsonPropertyName("timestamp")]
        public string Timestamp { get; set; }
    }
}

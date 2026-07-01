using System.Text.Json.Serialization;

namespace SmartStock.Entity.Concrete
{
    public class UrunIslemHareketi
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("username")]
        public string Username { get; set; }

        [JsonPropertyName("product_name")]
        public string ProductName { get; set; }

        [JsonPropertyName("action_type")]
        public string ActionType { get; set; } // 'Ekleme'

        [JsonPropertyName("details")]
        public string Details { get; set; }

        [JsonPropertyName("timestamp")]
        public string Timestamp { get; set; }
    }
}

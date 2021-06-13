using Newtonsoft.Json;
using System;

namespace API.Entities.Views
{
    public class HistoryView
    {
        [JsonProperty("id")]
        public Guid ID { get; set; }

        [JsonProperty("actionID")]
        public int ActionID { get; set; }

        [JsonProperty("action")]
        public string Action { get; set; }

        [JsonProperty("productID")]
        public Guid ProductID { get; set; }

        [JsonProperty("product")]
        public string Product { get; set; }

        [JsonProperty("warehouseID")]
        public int WarehouseID { get; set; }

        [JsonProperty("warehouse")]
        public string Warehouse { get; set; }

        [JsonProperty("userID")]
        public Guid UserID { get; set; }

        [JsonProperty("user")]
        public string User { get; set; }

        [JsonProperty("quantity")]
        public int Quantity { get; set; }

        [JsonProperty("date")]
        public DateTime Date { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.DTOs
{
    public class PopulateDbSettingsDTO
    {
        public int NbCategories { get; set; }
        public int NbProducts { get; set; }
        public int NbProductAvailabilities { get; set; }
        public int NbWarehouses { get; set; }
        public int NbHistories { get; set; }
    }
}
using API.Services.Abstraction;
using System;

namespace API.Services
{
    public class SystemClock : ISystemClock
    {
        public DateTime GetCurrentUtcTime()
        {
            return DateTime.UtcNow;
        }
    }
}

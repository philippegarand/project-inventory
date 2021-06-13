using Konscious.Security.Cryptography;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PasswordHelper
    {
        public static byte[] GenSalt()
        {
            var buffer = new byte[16];
            var rng = new RNGCryptoServiceProvider();
            rng.GetBytes(buffer);
            return buffer;
        }

        public static byte[] HashPassword(string password, byte[] salt)
        {
            // TODO: tweak values for it to not be too long, but not too easy
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = salt,
                DegreeOfParallelism = 4, // 2 cores
                Iterations = 2,
                MemorySize = 512 * 512 // 0.5 GB
            };

            return argon2.GetBytes(16);
        }

        public static bool VerifHash(string password, byte[] salt, byte[] hash)
        {
            var newHash = HashPassword(password, salt);
            return hash.SequenceEqual(newHash);
        }
    }
}
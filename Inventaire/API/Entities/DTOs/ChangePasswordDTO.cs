﻿namespace API.Entities.DTOs
{
    public class ChangePasswordDTO
    {
        public string oldPassword { get; set; }
        public string newPassword { get; set; }
    }
}
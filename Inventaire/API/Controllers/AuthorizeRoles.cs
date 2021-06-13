using Microsoft.AspNetCore.Authorization;
using Repository.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class AuthorizeRoles : AuthorizeAttribute
    {
        public AuthorizeRoles(params AccountTypeEnum[] roles)
        {
            Roles = string.Join(",", roles.Cast<int>().ToArray());
        }
    }
}
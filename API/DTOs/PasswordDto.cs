using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class PasswordDto
    {
        public string Old { get; set; }
        public string New { get; set; }
        public string Confirm { get; set; }
    }
}
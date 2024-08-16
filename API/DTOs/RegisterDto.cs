using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be complex")]
        public string Password { get; set; }

        [Required] public string DisplayName { get; set; }

        [Required] public string Username { get; set; }
        [Required] public string Gender { get; set; }
        [Required] public DateOnly? Birthday { get; set; }
        [Required] public string Native { get; set; }
        [Required] public string Learn { get; set; }
        [Required] public string Level { get; set; }
        [Required] public string City { get; set; }
        [Required] public string Country { get; set; }
    }
}
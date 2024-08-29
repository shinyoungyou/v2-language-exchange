using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CompleteDto
    {
        [Required] public string Gender { get; set; }
        [Required] public DateOnly? Birthday { get; set; }
        [Required] public string Native { get; set; }
        [Required] public string Learn { get; set; }
        [Required] public string Level { get; set; }
        [Required] public string City { get; set; }
        [Required] public string Country { get; set; }
    }
}
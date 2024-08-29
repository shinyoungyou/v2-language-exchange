using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public DateOnly Birthday { get; set; }   
        public string Gender { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public string Native { get; set; }
        public string Learn { get; set; }
        public string Level { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Bio { get; set; }
        public string Interests { get; set; }  
        public ICollection<Photo> Photos { get; set; }   
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
    }
}
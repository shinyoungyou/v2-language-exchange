using Domain;

namespace Application.Members
{
    public class Member
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string PhotoUrl { get; set; }
        public int Age { get; set; }   
        public string Gender { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public string Native { get; set; }
        public string Learn { get; set; }
        public string Level { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Bio { get; set; }
        public string Interests { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}
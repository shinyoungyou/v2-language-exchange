using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Group
    {
        public Group() // to allow entity framework to create a new schema
        {

        }
    
        public Group(string name) 
        {
            Name = name;
        }
        
        [Key]
        public string Name { get; set; }
        public ICollection<Connection> Connections { get; set; } = new List<Connection>();
    }
}
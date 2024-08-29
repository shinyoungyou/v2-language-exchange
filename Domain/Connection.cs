namespace Domain
{
  public class Connection
    {
        public Connection() // to allow entity framework to create a new schema
        {
            
        }
        public Connection(string connectionId, string username)
        {
            ConnectionId = connectionId;
            Username = username;
        }

        public string ConnectionId { get; set; }
        public string Username { get; set; }

    }
}
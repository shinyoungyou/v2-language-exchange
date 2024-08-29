using Application.Core;

namespace Application.Messages
{
    public class MessageParams : PaginationParams
    {
        public string Container { get; set; } = "Unread";
    }
}
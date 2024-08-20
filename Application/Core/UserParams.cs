namespace Application.Core
{
  public class UserParams : PaginationParams
    {
        // Filtering
        public string CurrentUsername { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 50;

        // Sorting
        public string OrderBy { get; set; } = "lastActive";

        // Generate a cache key based on the properties of UserParams
        public string ToCacheKey()
        {
            return $"{CurrentUsername}_{Gender}_{MinAge}_{MaxAge}_{OrderBy}";
        }
        
    }
}
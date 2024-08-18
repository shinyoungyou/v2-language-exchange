namespace Application.Members
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateOnly dob)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            // 2023 - 2003 = 20
            // 2003.07.22 > (2023.05.26 - 20 = 2003.05.26) : true
            // 19

            var age = today.Year - dob.Year;

            if (dob > today.AddYears(-age)) age--;

            return age;
        }
    }
}
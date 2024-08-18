using Application.Members;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, Member>()
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Birthday.CalculateAge()));
            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            // for the optional dateRead 
            CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
        }
    }
}
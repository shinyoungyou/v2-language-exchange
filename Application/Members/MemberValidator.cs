using FluentValidation;

namespace Application.Members
{
    public class MemberValidator : AbstractValidator<Member>
    {
        public MemberValidator()
        {
            RuleFor(x => x.DisplayName).NotEmpty();
            RuleFor(x => x.Native).NotEmpty();
            RuleFor(x => x.Learn).NotEmpty();
            RuleFor(x => x.Level).NotEmpty();
            RuleFor(x => x.Bio).NotEmpty();
            RuleFor(x => x.Interests).NotEmpty();
        }
    }
}
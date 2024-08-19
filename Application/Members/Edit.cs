using Application.Core;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Members
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Member Member { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Member).SetValidator(new MemberValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                user.DisplayName = request.Member.DisplayName ?? user.DisplayName;
                user.Native = request.Member.Native ?? user.Native;
                user.Learn = request.Member.Learn ?? user.Learn;
                user.Level = request.Member.Level ?? user.Level;
                user.Bio = request.Member.Bio;
                user.Interests = request.Member.Interests;

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Problem updating profile");

                return Result<Unit>.Success(Unit.Value);
            }
        }
   
    }
}
using ContributionsFeature.Application.Repository;
using ContributionsFeature.Domain;
using HRMS.Shared.Application.Common;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ContributionsFeature.Application.DTO
{
    public class CreateContributionHandler : IRequestHandler<CreateContributionRequest, ValueContributionDto>
    {
        private readonly IContributionsRepository _repository;
        public CreateContributionHandler(IContributionsRepository repository) => _repository = repository;

        public async Task<ValueContributionDto> Handle(CreateContributionRequest request, CancellationToken cancellationToken)
        {
            var entity = new ValueContribution
            {
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                Points = 0,
                Status = "Pending"
            };
            await _repository.AddItemAsync(entity);
            return new ValueContributionDto 
            { 
                Id = entity.Id, 
                Title = entity.Title,
                Description = entity.Description,
                Category = entity.Category,
                Points = entity.Points,
                Status = entity.Status,
                UserId = entity.UserId
            };
        }
    }

    public class GetAllContributionsHandler : IRequestHandler<GetAllContributionsRequest, PagedResponse<ValueContributionDto>>
    {
        private readonly IContributionsRepository _repository;
        public GetAllContributionsHandler(IContributionsRepository repository) => _repository = repository;

        public async Task<PagedResponse<ValueContributionDto>> Handle(GetAllContributionsRequest request, CancellationToken cancellationToken)
        {
            var (items, count) = await _repository.GetItemsWithCountAsync(x => x.DocumentType == nameof(ValueContribution), request, x => x.CreatedOn);
            return new PagedResponse<ValueContributionDto>(items.Select(x => new ValueContributionDto 
            { 
                Id = x.Id, 
                Title = x.Title,
                Description = x.Description,
                Category = x.Category,
                Points = x.Points,
                Status = x.Status,
                UserId = x.UserId
            }).ToList(), count, request.PageCriteria.Skip / request.PageCriteria.PageSize + 1, request.PageCriteria.PageSize);
        }
    }
}

namespace ContributionsFeature.Application.DTO
{
    public partial class CreateContributionRequest : IRequest<ValueContributionDto> { }
    public partial class GetAllContributionsRequest : IRequest<PagedResponse<ValueContributionDto>> { }
}

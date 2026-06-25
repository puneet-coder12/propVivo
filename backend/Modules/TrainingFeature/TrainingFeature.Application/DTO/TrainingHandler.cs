using TrainingFeature.Application.Repository;
using TrainingFeature.Domain;
using HRMS.Shared.Application.Common;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace TrainingFeature.Application.DTO
{
    public class CreateTrainingModuleHandler : IRequestHandler<CreateTrainingModuleRequest, TrainingModuleDto>
    {
        private readonly ITrainingRepository _repository;
        public CreateTrainingModuleHandler(ITrainingRepository repository) => _repository = repository;

        public async Task<TrainingModuleDto> Handle(CreateTrainingModuleRequest request, CancellationToken cancellationToken)
        {
            var entity = new TrainingModule
            {
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                ContentUrl = request.ContentUrl,
                IsMandatory = request.IsMandatory
            };
            await _repository.AddItemAsync(entity);
            return new TrainingModuleDto 
            { 
                Id = entity.Id, 
                Title = entity.Title,
                Description = entity.Description,
                Category = entity.Category,
                ContentUrl = entity.ContentUrl,
                IsMandatory = entity.IsMandatory
            };
        }
    }

    public class GetAllTrainingModulesHandler : IRequestHandler<GetAllTrainingModulesRequest, PagedResponse<TrainingModuleDto>>
    {
        private readonly ITrainingRepository _repository;
        public GetAllTrainingModulesHandler(ITrainingRepository repository) => _repository = repository;

        public async Task<PagedResponse<TrainingModuleDto>> Handle(GetAllTrainingModulesRequest request, CancellationToken cancellationToken)
        {
            var (items, count) = await _repository.GetItemsWithCountAsync(x => x.DocumentType == nameof(TrainingModule), request, x => x.CreatedOn);
            return new PagedResponse<TrainingModuleDto>(items.Select(x => new TrainingModuleDto 
            { 
                Id = x.Id, 
                Title = x.Title,
                Description = x.Description,
                Category = x.Category,
                ContentUrl = x.ContentUrl,
                IsMandatory = x.IsMandatory
            }).ToList(), count, request.PageCriteria.Skip / request.PageCriteria.PageSize + 1, request.PageCriteria.PageSize);
        }
    }
}

namespace TrainingFeature.Application.DTO
{
    public partial class CreateTrainingModuleRequest : IRequest<TrainingModuleDto> { }
    public partial class GetAllTrainingModulesRequest : IRequest<PagedResponse<TrainingModuleDto>> { }
}

using RecognitionFeature.Application.Repository;
using RecognitionFeature.Domain;
using HRMS.Shared.Application.Common;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
namespace RecognitionFeature.Application.DTO
{
    public class CreateRecognitionHandler : IRequestHandler<CreateRecognitionRequest, RecognitionDto>
    {
        private readonly IRecognitionRepository _repository;
        public CreateRecognitionHandler(IRecognitionRepository repository) => _repository = repository;
        public async Task<RecognitionDto> Handle(CreateRecognitionRequest request, CancellationToken cancellationToken)
        {
            var entity = new Recognition
            {
                ToUserId = request.ReceiverId,
                Message = request.Message,
                Category = request.Category
            };
            await _repository.AddItemAsync(entity);
            return new RecognitionDto 
            { 
                Id = entity.Id, 
                Message = entity.Message,
                Category = entity.Category,
                GiverId = entity.FromUserId,
                ReceiverId = entity.ToUserId,
                CreatedOn = entity.CreatedOn ?? DateTime.UtcNow
            };
        }
    }
    public class GetAllRecognitionsHandler : IRequestHandler<GetAllRecognitionsRequest, PagedResponse<RecognitionDto>>
    {
        private readonly IRecognitionRepository _repository;
        public GetAllRecognitionsHandler(IRecognitionRepository repository) => _repository = repository;
        public async Task<PagedResponse<RecognitionDto>> Handle(GetAllRecognitionsRequest request, CancellationToken cancellationToken)
        {
            var (items, count) = await _repository.GetItemsWithCountAsync(x => true, request, x => x.CreatedOn);
            return new PagedResponse<RecognitionDto>(items.Select(x => new RecognitionDto 
            { 
                Id = x.Id, 
                Message = x.Message,
                Category = x.Category,
                GiverId = x.FromUserId,
                ReceiverId = x.ToUserId,
                CreatedOn = x.CreatedOn ?? DateTime.UtcNow
            }).ToList(), count, request.PageCriteria.Skip / request.PageCriteria.PageSize + 1, request.PageCriteria.PageSize);
        }
    }
}
namespace RecognitionFeature.Application.DTO
{
    public partial class CreateRecognitionRequest : IRequest<RecognitionDto> { }
    public partial class GetAllRecognitionsRequest : IRequest<PagedResponse<RecognitionDto>> { }
}

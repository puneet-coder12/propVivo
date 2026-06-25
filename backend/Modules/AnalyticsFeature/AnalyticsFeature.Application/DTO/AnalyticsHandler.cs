using AnalyticsFeature.Application.Repository;
using AnalyticsFeature.Domain;
using HRMS.Shared.Application.Common;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AnalyticsFeature.Application.DTO
{
    public class GenerateReportHandler : IRequestHandler<GenerateReportRequest, AnalyticsReportDto>
    {
        private readonly IAnalyticsRepository _repository;
        public GenerateReportHandler(IAnalyticsRepository repository) => _repository = repository;

        public async Task<AnalyticsReportDto> Handle(GenerateReportRequest request, CancellationToken cancellationToken)
        {
            var entity = new AnalyticsReport
            {
                Title = request.Title,
                Category = request.Category,
                DataJson = "{}",
                GeneratedDate = DateTime.UtcNow
            };
            await _repository.AddItemAsync(entity);
            return new AnalyticsReportDto 
            { 
                Id = entity.Id, 
                Title = entity.Title,
                Category = entity.Category,
                DataJson = entity.DataJson,
                GeneratedDate = entity.GeneratedDate
            };
        }
    }

    public class GetAllReportsHandler : IRequestHandler<GetAllReportsRequest, PagedResponse<AnalyticsReportDto>>
    {
        private readonly IAnalyticsRepository _repository;
        public GetAllReportsHandler(IAnalyticsRepository repository) => _repository = repository;

        public async Task<PagedResponse<AnalyticsReportDto>> Handle(GetAllReportsRequest request, CancellationToken cancellationToken)
        {
            var (items, count) = await _repository.GetItemsWithCountAsync(x => x.DocumentType == nameof(AnalyticsReport), request, x => x.CreatedOn);
            return new PagedResponse<AnalyticsReportDto>(items.Select(x => new AnalyticsReportDto 
            { 
                Id = x.Id, 
                Title = x.Title,
                Category = x.Category,
                DataJson = x.DataJson,
                GeneratedDate = x.GeneratedDate
            }).ToList(), count, request.PageCriteria.Skip / request.PageCriteria.PageSize + 1, request.PageCriteria.PageSize);
        }
    }
}

namespace AnalyticsFeature.Application.DTO
{
    public partial class GenerateReportRequest : IRequest<AnalyticsReportDto> { }
    public partial class GetAllReportsRequest : IRequest<PagedResponse<AnalyticsReportDto>> { }
}

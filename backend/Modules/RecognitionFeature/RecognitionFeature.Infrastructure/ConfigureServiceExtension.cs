using RecognitionFeature.Application.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using HRMS.Core.Postgres.Interfaces;

namespace RecognitionFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddRecognitionDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, RecognitionEntityConfigurator>());
            services.AddScoped<IRecognitionRepository, RecognitionRepository>();
            return services;
        }
    }
}

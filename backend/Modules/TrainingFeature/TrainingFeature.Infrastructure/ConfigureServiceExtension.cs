using TrainingFeature.Application.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using HRMS.Core.Postgres.Interfaces;

namespace TrainingFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddTrainingDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, TrainingEntityConfigurator>());
            services.AddScoped<ITrainingRepository, TrainingRepository>();
            return services;
        }
    }
}

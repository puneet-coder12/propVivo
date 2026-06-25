using HRCopilotFeature.Application.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using HRMS.Core.Postgres.Interfaces;

namespace HRCopilotFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddCopilotDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, CopilotEntityConfigurator>());
            services.AddScoped<ICopilotRepository, CopilotRepository>();
            return services;
        }
    }
}

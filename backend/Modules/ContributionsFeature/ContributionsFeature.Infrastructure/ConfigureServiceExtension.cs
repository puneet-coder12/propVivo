using ContributionsFeature.Application.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using HRMS.Core.Postgres.Interfaces;

namespace ContributionsFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddContributionsDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, ContributionsEntityConfigurator>());
            services.AddScoped<IContributionsRepository, ContributionsRepository>();
            return services;
        }
    }
}

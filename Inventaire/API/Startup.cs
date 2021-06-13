using API.Hubs;
using API.Orchestrators;
using API.Services;
using API.Services.Abstraction;
using Autofac;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Repository.DataAccess;
using Repository.Models;
using System;
using System.Text;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            // Reference: https://medium.com/swlh/creating-a-simple-real-time-chat-with-net-core-reactjs-and-signalr-6367dcadd2c6
            services.AddSignalR();

            string mySqlConnectionStr;
            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("IS_DOCKER")))
            {
                mySqlConnectionStr = Configuration.GetConnectionString("DefaultConnection");
            }
            else
            {
                mySqlConnectionStr = $"" +
                $"Server={Environment.GetEnvironmentVariable("DB_ADDR")}; " +
                $"Port={Environment.GetEnvironmentVariable("DB_PORT")}; " +
                $"Database={Environment.GetEnvironmentVariable("DB_NAME")}; " +
                $"Uid={Environment.GetEnvironmentVariable("DB_USER")}; " +
                $"Pwd={Environment.GetEnvironmentVariable("DB_PASS")};";
            }

            services.AddDbContext<InventoryContext>(options => options.UseMySql(mySqlConnectionStr, ServerVersion.AutoDetect(mySqlConnectionStr)));

            // Reference: https://geekrodion.com/blog/asp-react-blog/authentication
            // Reference: https://codeburst.io/jwt-auth-in-asp-net-core-148fb72bed03
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = true;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(Configuration.GetValue<string>("JWTSecretKey"))
                    )
                };
            });

            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                c.AddSecurityDefinition("jwt_auth", new OpenApiSecurityScheme
                {
                    Name = "Bearer",
                    BearerFormat = "JWT",
                    Scheme = "bearer",
                    Description = "Specify an authorization token",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Id = "jwt_auth",
                            Type = ReferenceType.SecurityScheme,
                        }
                    },
                    Array.Empty<string>()
                  }
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            app.UseCors(builder => builder
               .AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader()
            );

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<HistoryHub>("/hubs/history");
                endpoints.MapHub<ProductAvailabilityHub>("/hubs/productavailability");
            });

            using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
            var context = serviceScope.ServiceProvider.GetRequiredService<InventoryContext>();
            context.Database.Migrate();
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            // --[SERVICES]--
            // --[IBASE]--
            builder.RegisterType<BaseService<AccountType, int>>()
                .As<IBaseService<AccountType, int>>();

            builder.RegisterType<BaseService<Category, int>>()
                .As<IBaseService<Category, int>>();

            builder.RegisterType<BaseService<Warehouse, int>>()
                .As<IBaseService<Warehouse, int>>();

            builder.RegisterType<BaseService<ProductRented, Guid>>()
                .As<IBaseService<ProductRented, Guid>>();

            // --[ICUSTOM]--
            builder.RegisterType<ProductService>()
                .As<IProductService>();

            builder.RegisterType<ProductAvailabilityService>()
                .As<IProductAvailabilityService>();

            builder.RegisterType<UserService>()
                .As<IUserService>();

            builder.RegisterType<HistoryService>()
                .As<IHistoryService>();

            builder.RegisterType<AuthService>()
                .SingleInstance()
                .As<IAuthService>()
                .WithParameter("jwtSecret", Configuration.GetValue<string>("JWTSecretKey"))
                .WithParameter("jwtLifespan", Configuration.GetValue<int>("JWTLifespan"));

            // --[REPOSITORIES]--
            builder.RegisterType<AccountTypeRepository>()
                .As<IRepository<AccountType, int>>();

            builder.RegisterType<CategoryRepository>()
                .As<IRepository<Category, int>>();

            builder.RegisterType<HistoryRepository>()
                .As<IRepository<History, Guid>>();

            builder.RegisterType<ProductAvailabilityRepository>()
                .As<IRepository<ProductAvailability, Guid>>();

            builder.RegisterType<ProductRepository>()
                .As<IRepository<Product, Guid>>();

            builder.RegisterType<ProductRentedRepository>()
                .As<IRepository<ProductRented, Guid>>();

            builder.RegisterType<UserRepository>()
                .As<IRepository<User, Guid>>();

            builder.RegisterType<WarehouseRepository>()
                .As<IRepository<Warehouse, int>>();

            // --[OTHERS]--
            builder.RegisterType<Orchestrator>()
                .As<Orchestrator>();

            builder.RegisterType<SystemClock>()
                .As<ISystemClock>()
                .SingleInstance();
        }
    }
}
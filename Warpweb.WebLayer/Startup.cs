using System;
using System.IO;
using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.WebLayer.Configs;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.OpenApi.Models;
using Warpweb.WebLayer.Requirements;
using Microsoft.AspNetCore.Authorization;
using Warpweb.WebLayer.AuthorizationHandlers;
using Microsoft.Extensions.Logging;
using Warpweb.WebLayer.Controllers;

namespace Warpweb.WebLayer
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
            services.Configure<JwtConfig>(Configuration.GetSection("JwtConfig"));

            services.AddDbContext<ApplicationDbContext>(options => options
                .UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()))
                .UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection"), sqlOptions => sqlOptions.MaxBatchSize(100)));

            // Needed per service
            services.AddScoped<OrganizerService>();
            services.AddScoped<SecurityService>();
            services.AddScoped<MainEventService>();
            services.AddScoped<TicketService>();
            services.AddScoped<TicketTypeService>();
            services.AddScoped<VenueService>();
            services.AddScoped<CrewService>();
            services.AddScoped<UserService>();
            services.AddScoped<SeatMapService>();
            services.AddScoped<ReportsService>();
            services.AddHttpContextAccessor();
            services.AddTransient<IMainEventProvider, MainEventProvider>();

            // Enable Swagger for API documentation
            services.AddSwaggerGen(swagger =>
            {
                //This is to generate the Default UI of Swagger Documentation  
                swagger.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "JWT Token Authentication API",
                    Description = "Warpweb - .NET 5 Web API"
                });

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                swagger.IncludeXmlComments(xmlPath);

                // To Enable authorization using Swagger (JWT)  
                swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                });

                swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                          new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}
                    }
                });
            });

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<IdentityRole>()
                .AddRoleManager<RoleManager<IdentityRole>>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            var key = Encoding.ASCII.GetBytes(Configuration["JwtConfig:Secret"]);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                RequireExpirationTime = false,
                ClockSkew = TimeSpan.FromSeconds(60)
            };

            services.AddSingleton(tokenValidationParameters);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwt =>
            {
                jwt.SaveToken = true;
                jwt.TokenValidationParameters = tokenValidationParameters;
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("CrewAdmin", policy =>
                    policy.Requirements.Add(new CrewPermissionRequirement(CrewPermissionType.CrewAdmin)));
                options.AddPolicy("CheckInAdmin", policy =>
                    policy.Requirements.Add(new CrewPermissionRequirement(CrewPermissionType.CheckInAdmin)));
                options.AddPolicy("TicketAdmin", policy =>
                    policy.Requirements.Add(new CrewPermissionRequirement(CrewPermissionType.TicketAdmin)));
                options.AddPolicy("SeatMapAdmin", policy =>
                    policy.Requirements.Add(new CrewPermissionRequirement(CrewPermissionType.SeatMapAdmin)));
                options.AddPolicy("UserAdmin", policy =>
                    policy.Requirements.Add(new CrewPermissionRequirement(CrewPermissionType.UserAdmin)));
                options.AddPolicy("ReportAdmin", policy =>
                    policy.Requirements.Add(new CrewPermissionRequirement(CrewPermissionType.ReportAdmin)));
                options.AddPolicy("VenueAdmin", policy =>
                    policy.Requirements.Add(new CrewPermissionRequirement(CrewPermissionType.VenueAdmin)));
            });

            services.AddTransient<IAuthorizationHandler, CrewPermissionHandler>();
            services.AddControllers();

            services.Configure<IdentityOptions>(options =>
            {
                //password settings. Må oppdateres
                options.Password.RequireDigit = false; //settes til true senere. Alle testpassord er uten tall
                options.Password.RequiredLength = 10; //14 er korrekt
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredUniqueChars = 0;
                //lockout settings
                options.Lockout.AllowedForNewUsers = true;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5000;
                //User settings
                options.User.RequireUniqueEmail = true;
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.@+-"; //Husk å teste for æøå og + - i brukernavn
                options.SignIn.RequireConfirmedAccount = false; //Bør kanskje ikke være true?
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddHostedService<DbSeed>();

            services.AddControllersWithViews().AddNewtonsoftJson(options =>
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //    app.UseMigrationsEndPoint();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Error");
            //    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            //    app.UseHsts();
            //}
            app.UseGlobalExceptionErrorHandler();
            loggerFactory.AddFile("Logs/Errorlog.txt");

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Warpweb API V1");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = Path.Join(env.ContentRootPath, "ClientApp");

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}

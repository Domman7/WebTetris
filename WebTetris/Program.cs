using BL;
using DAL;
using Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
using ORMDAL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(
    options =>
    {
        options.LoginPath = new PathString("/User/Login");
        options.AccessDeniedPath = new PathString("/User/Login");
        options.ExpireTimeSpan = new TimeSpan(7, 0, 0, 0);
    });
builder.Services.AddAuthorization();

builder.Services.AddControllersWithViews();

// Register dependencies
builder.Services.AddTransient<IUsersDAL, ORMUsersDAL>();
builder.Services.AddTransient<IUsersBL, UsersBL>();
builder.Services.AddTransient<IGamesDAL, ORMGamesDAL>();
builder.Services.AddTransient<IGamesBL, GamesBL>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=User}/{action=Login}/{id?}");

app.Run();

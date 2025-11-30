using Entities;
using Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using WebTetris.Models.User;
using System.Security.Claims;

namespace WebTetris.Controllers
{
    public class UserController : Controller
    {
        private IUsersBL _bll;
        public UserController(IUsersBL bll)
        {
            _bll = bll;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {
            var user = _bll.GetByLogin(loginModel.Login);

            if (user != null && user.Password == loginModel.Password)
            {
                var identity = new CustomUserIdentity(user);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
            }
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult Registration()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Registration(RegistrationModel registrationModel)
        {
            User newUser = new User()
            {
                Name = registrationModel.Name,
                Login = registrationModel.Login,
                Password = registrationModel.Password,
                RegistrationDate = DateTime.Now
            };
            _bll.AddUser(newUser);
            var identity = new CustomUserIdentity(newUser);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
            return RedirectToAction("Index", "Home");
        }

        public IActionResult Get(int id)
        {
            var user = _bll.GetById(id);

            if (user != null)
            {
                return View(new UserModel() { Id = user.Id, Name = $"{user.Name}" });
            }
            else
            {
                return View();
            }
        }
    }
}

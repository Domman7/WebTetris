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
            if (!ModelState.IsValid)
            {
                return View(loginModel);
            }

            var user = _bll.GetByLogin(loginModel.Login);

            if (user != null && user.Password == loginModel.Password)
            {
                var identity = new CustomUserIdentity(user);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
                return RedirectToAction("Index", "Home");
            }

            ModelState.AddModelError("", "Неверный логин или пароль");
            return View(loginModel);
        }

        [HttpGet]
        public IActionResult Registration()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Registration(RegistrationModel registrationModel)
        {
            if (!ModelState.IsValid)
            {
                return View(registrationModel);
            }

            if (string.IsNullOrWhiteSpace(registrationModel.Name) ||
                string.IsNullOrWhiteSpace(registrationModel.Login) ||
                string.IsNullOrWhiteSpace(registrationModel.Password))
            {
                ModelState.AddModelError("", "Все поля должны быть заполнены");
                return View(registrationModel);
            }

            var existingUser = _bll.GetByLogin(registrationModel.Login);
            if (existingUser != null)
            {
                ModelState.AddModelError("Login", "Пользователь с таким логином уже существует");
                return View(registrationModel);
            }

            try
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
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"Произошла ошибка при регистрации: {ex.Message}");
                return View(registrationModel);
            }
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

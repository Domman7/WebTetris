using Entities;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebTetris.Models;
using WebTetris.Models.Home;

namespace WebTetris.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private IUsersBL _usersBL;
        private IGamesBL _gamesBL;

        public HomeController(ILogger<HomeController> logger, IUsersBL usersBL, IGamesBL gamesBL)
        {
            _logger = logger;
            _usersBL = usersBL;
            _gamesBL = gamesBL;
        }

        public IActionResult Index(int id, string name)
        {
            TempData["Success"] = "Success";

            if (User.Identity.IsAuthenticated)
            {
                var userName = User.Identity.Name;
            }

            return View("Index");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public IActionResult Index()
        {
            Game newGame = new Game();
            GameModel gameModel = new GameModel()
            {
                Score = 0,
                GameDate = DateTime.Now,
                UserId = _usersBL.GetByLogin(User.Identity.Name).Id
            };
            return View(gameModel);
        }

        [HttpPost]
        public IActionResult SaveGame(int score)
        {
            Game game = new Game()
            {
                Score = score,
                GameDate = DateTime.Now,
                UserId = _usersBL.GetByLogin(User.Identity.Name).Id
            };
            _gamesBL.AddGame(game);

            return RedirectToAction("Index", "Home");
        }
    }
}
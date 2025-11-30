using Entities;
using Interfaces;

namespace DAL
{
    public class GamesDAL : IGamesDAL
    {
        private List<Game> games = new List<Game>();

        public Game GetById(int id)
        {
            return games.FirstOrDefault(item => item.Id == id);
        }

        public Game GetByUserId(int userId)
        {
            return games.FirstOrDefault(item => item.UserId == userId);
        }

        public void AddGame(Game game)
        {
            games.Add(game);
        }
    }
}
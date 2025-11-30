using Interfaces;
using Entities;

namespace BL
{
    public class GamesBL : IGamesBL
    {
        private readonly IGamesDAL _dal;

        public GamesBL(IGamesDAL dal)
        {
            _dal = dal;
        }
        public Game GetByUserId(int userId)
        {
            return _dal.GetByUserId(userId);
        }

        public void AddGame(Game game)
        {
            _dal.AddGame(game);
        }
    }
}

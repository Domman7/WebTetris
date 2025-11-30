using Entities;

namespace Interfaces
{
    public interface IGamesBL
    {
        Game GetByUserId(int UserID);
        void AddGame(Game game);
    }
}


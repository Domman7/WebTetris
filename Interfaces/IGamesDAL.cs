using Entities;

namespace Interfaces
{
    public interface IGamesDAL
    {
        Game GetByUserId(int userId);
        void AddGame(Game game);
    }
}

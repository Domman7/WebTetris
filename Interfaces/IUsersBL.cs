using Entities;

namespace Interfaces
{
    public interface IUsersBL
    {
        User GetById(int id);
        User GetByLogin(string login);
        void AddUser(User user);

    }
}
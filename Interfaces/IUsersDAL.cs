using Entities;

namespace Interfaces
{
    public interface IUsersDAL
    {
        User GetById(int id);
        User GetByLogin(string login);
        void AddUser(User user);
    }
}

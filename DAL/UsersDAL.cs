using Entities;
using Interfaces;

namespace DAL
{
    public class UsersDAL : IUsersDAL
    {
        private List<User> users = new List<User>();
        public User GetById(int id)
        {
            return users.FirstOrDefault(item => item.Id == id);
        }
        public User GetByLogin(string login)
        {
            return users.FirstOrDefault(item => item.Name == login);
        }
        public void AddUser(User user)
        {
            users.Add(user);
        }
    }
}
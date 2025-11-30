using Entities;
using Interfaces;

namespace BL
{
    public class UsersBL : IUsersBL
    {
        private IUsersDAL _dal;

        public UsersBL(IUsersDAL dal)
        {
            _dal = dal;
        }

        public User GetByLogin(string login)
        {
            return _dal.GetByLogin(login);
        }

        public User GetById(int id)
        {
            return _dal.GetById(id);
        }

        public void AddUser(User user)
        {
            _dal.AddUser(user);
        }
    }
}

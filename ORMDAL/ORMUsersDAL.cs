using Interfaces;

namespace ORMDAL
{
    public class ORMUsersDAL : IUsersDAL
    {
        public Entities.User GetByLogin(string login)
        {
            var context = new DefaultDBContext();
            try
            {
                var user = context.User.FirstOrDefault(item => item.Login == login);

                if (user == null)
                {
                    return null;
                }
                var entity = new Entities.User()
                {
                    Id = user.Id,
                    Name = user.Name,
                    Password = user.Password,
                    Login = user.Login,
                    RegistrationDate = user.RegistrationDate
                };
                return entity;
            }
            finally
            {
                context.Dispose();
            }
        }

        public Entities.User GetById(int id)
        {
            var context = new DefaultDBContext();
            try
            {
                var user = context.User.FirstOrDefault(item => item.Id == id);

                if (user == null)
                {
                    return null;
                }
                var entity = new Entities.User()
                {
                    Id = user.Id,
                    Name = user.Name,
                    Password = user.Password,
                    Login = user.Login,
                    RegistrationDate = user.RegistrationDate
                };
                return entity;
            }
            finally
            {
                context.Dispose();
            }

        }

        public void AddUser(Entities.User user)
        {
            var context = new DefaultDBContext();
            try
            {
                context.User.Add(new User()
                {
                    Name = user.Name,
                    Password = user.Password,
                    Login = user.Login,
                    RegistrationDate = user.RegistrationDate
                });
                context.SaveChanges();
            }
            finally
            {
                context.Dispose();
            }
        }
    }
}

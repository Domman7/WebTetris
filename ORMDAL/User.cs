namespace ORMDAL
{
    public partial class User
    {
        public User()
        {
            Game = new HashSet<Game>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public DateTime RegistrationDate { get; set; }
        public virtual ICollection<Game> Game { get; set; }
    }
}

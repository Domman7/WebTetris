namespace Entities
{
    public class Game
    {
        public int Id { get; set; }
        public DateTime? GameDate { get; set; }
        public int Score { get; set; }
        public int? UserId { get; set; }
    }
}
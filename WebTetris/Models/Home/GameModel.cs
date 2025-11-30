namespace WebTetris.Models.Home
{
    public class GameModel
    {
        public int Id { get; set; }
        public DateTime GameDate { get; set; }
        public int UserId { get; set; }
        public int Score { get; set; }
    }
}
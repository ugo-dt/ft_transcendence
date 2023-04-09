export class Elo {
  public static kFactor = 32; // The K-factor determines how quickly ratings change after a game
  public static defaultRating = 1200; // The default rating for new players

  public static calculateExpectedScore(playerRating: number, opponentRating: number): number {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  public static calculateRatingChange(playerRating: number, opponentRating: number, actualScore: number): number {
    const expectedScore = this.calculateExpectedScore(playerRating, opponentRating);
    return Math.round(this.kFactor * (actualScore - expectedScore));
  }

  public static updateRatings(playerRating: number, opponentRating: number, playerWins: boolean): [number, number] {
    const actualScore = playerWins ? 1 : 0;
    const ratingChange = this.calculateRatingChange(playerRating, opponentRating, actualScore);
    return [playerRating + ratingChange, opponentRating - ratingChange];
  }

  public static getNewPlayerRating(): number {
    return this.defaultRating;
  }
}

// Example usage:
const player1Rating = 1600;
const player2Rating = 1400;
const player1Wins = true;

const [newPlayer1Rating, newPlayer2Rating] = Elo.updateRatings(player1Rating, player2Rating, player1Wins);

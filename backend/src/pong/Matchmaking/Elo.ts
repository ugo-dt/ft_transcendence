namespace Elo {
  export const kFactor: number = 32;

  function _getExpectedScore(playerRating: number, opponentRating: number): number {
    const exponent = (opponentRating - playerRating) / 400;
    return 1 / (1 + Math.pow(10, exponent));
  }

  export function updateRatings(player1Rating: number, player2Rating: number, player1Wins: boolean): [number, number] {
    const player1ExpectedScore = _getExpectedScore(player1Rating, player2Rating);
    const player2ExpectedScore = 1 - player1ExpectedScore;

    const player1ActualScore = player1Wins ? 1 : 0;
    const player2ActualScore = player1Wins ? 0 : 1;

    const newPlayer1Rating = Math.max(1, Math.round(player1Rating + kFactor * (player1ActualScore - player1ExpectedScore)));
    const newPlayer2Rating = Math.max(1, Math.round(player2Rating + kFactor * (player2ActualScore - player2ExpectedScore)));

    return [newPlayer1Rating, newPlayer2Rating];
  }
}

export default Elo;
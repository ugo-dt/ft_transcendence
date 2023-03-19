// Game page
//
// Play
//  Ranked
//  Invite a friend
//  Against the computer

import "./style/Game.css"

function Game() {
	return (
    <div className="Game">
      <h1>Play vs:</h1>
      <button>rank</button>
      <br/>
      <button>bot</button>
      <br/>
      <button>friend</button>
    </div>
	);
}

export default Game;
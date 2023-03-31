import "./style/Home.css"
import PongDemo from "../layouts/PongDemo";
import GameModes from "../layouts/GameModes";

function Home() {

  return (
    <div className="Home">
      <div className="home-content">
        <div className="home-title">
          <h1>Play Pong</h1>
        </div>
        <div className="home-sections">
          <section className="pong-demo">
            <PongDemo />
          </section>
          <section>
            <GameModes />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;
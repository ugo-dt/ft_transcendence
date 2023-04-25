import PongDemo from "../layouts/PongDemo";
import GameModes from "../layouts/GameModes";
import "./style/Home.css"

function Home() {
  document.title = "ft_transcendence - Home";

  return (
    <div className="Home">
      <div className="home-main-content">
        <div className="home-title">
          <h1>ft_transcendence</h1>
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
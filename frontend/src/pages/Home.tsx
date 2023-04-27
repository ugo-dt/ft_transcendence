import PongDemo from "../layouts/PongDemo";
import GameModes from "../layouts/GameModes";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Request from "../components/Request";
import "./style/Home.css"

function Home() {
  document.title = "ft_transcendence - Home";
  const navigate = useNavigate();
  const [parameters] = useSearchParams();

  useEffect(() => {
    if (parameters.get("code")) {
      Request.signIn(parameters.get("code")).then().then(res => {
        navigate("/home");
        window.location.reload();
      }).catch(err => {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
          console.error("Request has been canceled!");
        } else {
          console.error(err);
        }
      });
    }
  }, []);

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
import "./style/Home.css"
import PongDemo from "../layouts/PongDemo";
import GameModes from "../layouts/GameModes";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context";
import Request from "../components/Request";

function Home() {
  const navigate = useNavigate();
  const [parameters] = useSearchParams();
  const setUser = useContext(UserContext).setUser;

  useEffect(() => {
    if (parameters.get("code")) {
      Request.signIn(parameters.get("code")).then().then(res => {
        setUser(res);
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
      <div className="home-game-invites">
        add game invites here
      </div>
    </div>
  );
}

export default Home;
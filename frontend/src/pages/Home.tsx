import "./style/Home.css"
import PongDemo from "../layouts/PongDemo";
import GameModes from "../layouts/GameModes";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context";

function Home() {
  const navigate = useNavigate();
  const [parameters] = useSearchParams();
  const {user, setUser} = useContext(UserContext);

	useEffect(() => {
    const controller = new AbortController();

		const fct = async () => {
      try {
        const {data} = await axios.post(
          "http://localhost:3000/api/auth/signin",
          {
            code: parameters.get("code"),
          },
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );
        setUser(data);
        navigate("/home");
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
          console.error("Request has been canceled!");
        } else {
          console.error(error);
        }
      }
    }

    if (parameters.get("code")) { fct(); }
    return () => {
      controller.abort();
    };
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
import "./style/Navbar.css"
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { IUser } from "../types";
import Request from "../components/Request";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function signOut() {
    Request.signOut().then(res => {
      setUser(null);
      navigate('/home');
    }).catch(error => {
      console.error(error);
    });
  }

  if (user) {
    return <NavBarConnected user={user} signOut={signOut} />;
  }
  return <NavBarNotConnected />
}

interface NavBarProps {
  user: IUser | null;
  signOut: () => Promise<void>;
}

function NavBarConnected({ user, signOut }: NavBarProps) {
  return (
    <nav>
      <NavLink className="NavLink" to="/home">Home</NavLink>
      <NavLink className="NavLink" to={`/profile/${user ? user.username.toLowerCase() : ''}`}>Profile</NavLink>
      <NavLink className="NavLink" to="/watch">Watch</NavLink>
      <NavLink className="NavLink" to="/leaderboard">Leaderboard</NavLink>
      <NavLink className="NavLink" to="/friends">Friends</NavLink>
      <NavLink className="NavLink" to="/messages">Messages</NavLink>
      <NavLink className="NavLink" to="" onClick={signOut}>Sign out</NavLink>
    </nav>
  );
}

function NavBarNotConnected() {
  return (
    <nav>
      <NavLink className="NavLink" to="/home">Home</NavLink>
      <NavLink className="NavLink" to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0e31b61fc51b301f5e0594458baf1b0981c4106aff593588c1abb9708b7421c5&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code">Sign in with 42</NavLink>
    </nav>
  );
}
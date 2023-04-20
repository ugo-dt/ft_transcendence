import { useContext } from "react";
import "./style/Navbar.css"
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import axios from "axios";
import { IUser } from "../types";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function signOut() {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signout",
        {},
        {
          withCredentials: true
        }
      );
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  if (user) { return <NavBarConnected user={user} signOut={signOut} />; }
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
      <NavLink className="NavLink" to="/">Home</NavLink>
      <NavLink className="NavLink" to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-323464d0d3ecfc69260024761223d14b72b291dda193e39d980e413305d530d4&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code">Sign in with 42</NavLink>
    </nav>
  );
}
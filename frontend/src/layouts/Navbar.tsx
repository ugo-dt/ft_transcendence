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
      <NavLink className="NavLink" to={"/messages"}>Messages</NavLink>
      <NavLink className="NavLink" to="" onClick={signOut}>Sign out</NavLink>
    </nav>
  );
}

function NavBarNotConnected() {
  return (
    <nav>
      <NavLink className="NavLink" to="/home">Home</NavLink>
      <NavLink className="NavLink" to={import.meta.env.VITE_API_REDIRECT_URI}>Sign in with 42</NavLink>
    </nav>
  );
}
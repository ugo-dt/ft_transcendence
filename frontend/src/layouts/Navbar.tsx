import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { IUser } from "../types";
import Request from "../components/Request";
import "./style/Navbar.css"

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
      <NavLink className="NavLink" to="/">Home</NavLink>
      <NavLink className="NavLink" to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-8b655c7560f459606bfba1ea913c3d38861494de821c10eba2eb12b2321362f6&redirect_uri=http%3A%2F%2F192.168.1.136%3A5173&response_type=code">Sign in with 42</NavLink>
    </nav>
  );
}
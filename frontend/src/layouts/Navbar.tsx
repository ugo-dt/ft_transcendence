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
        "http://192.168.1.178:3000/api/auth/signout",
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
      <NavLink className="NavLink" to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0e31b61fc51b301f5e0594458baf1b0981c4106aff593588c1abb9708b7421c5&redirect_uri=http%3A%2F%2F192.168.1.178%3A5173&response_type=code">Sign in with 42</NavLink>
    </nav>
  );
}
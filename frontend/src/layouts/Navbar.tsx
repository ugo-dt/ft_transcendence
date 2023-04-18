import { useContext } from "react";
import "./style/Navbar.css"
import { NavLink } from "react-router-dom";
import { Context } from "../context";

interface NavbarProps {
  isSignedIn: boolean,
}

function Navbar({ isSignedIn }: NavbarProps) {
  const client = useContext(Context).client;

  return (
    <nav>
      <NavLink className={"NavLink"} to="/home">Home</NavLink>
      <NavLink className={"NavLink"} to="/profile" >Profile</NavLink>
      <NavLink className={"NavLink"} to="/watch">Watch</NavLink>
      <NavLink className={"NavLink"} to="/leaderboards">Leaderboards</NavLink>
      <NavLink className={"NavLink"} to="/friends">Friends</NavLink>
      <NavLink className="NavLink" to="/messages">Messages</NavLink>
      {
        (isSignedIn && <NavLink className="NavLink" to="/signout">Sign out</NavLink>)
                    || <NavLink className="NavLink" to="/signin">Sign in with 42</NavLink>
      }
    </nav>
  );
}

export default Navbar;

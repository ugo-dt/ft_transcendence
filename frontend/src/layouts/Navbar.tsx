import "./style/Navbar.css"
import { NavLink } from "react-router-dom";

interface NavbarProps {
  isSignedIn: boolean,
}

function Navbar({ isSignedIn }: NavbarProps) {
  return (
    <nav>
      <NavLink className={"NavLink"} to="/home">Home</NavLink>
      <NavLink className={"NavLink"} to="/profile/me">Profile</NavLink>
      <NavLink className={"NavLink"} to="/watch">Watch</NavLink>
      <NavLink className={"NavLink"} to="/rankings">Rankings</NavLink>
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

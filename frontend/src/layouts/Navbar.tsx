import "./style/Navbar.css"
import { NavLink } from "react-router-dom";
import BasicMenu from "../components/BasicMenu";

const mainRoutes = ["Home", "Profile", "Watch", "Rankings"];

interface NavbarProps {
  isSignedIn: boolean,
}

function Navbar({ isSignedIn }: NavbarProps) {
  return (
    <nav>
      {
        mainRoutes.map((route) => (
          <NavLink key={route} className="NavLink" to={'/' + route.toLowerCase()}>
            {route}
          </NavLink>
        ))
      }
      <NavLink className={"NavLink"} to="/friends">Friends</NavLink>
      <NavLink className="NavLink" to="/messages">Messages</NavLink>
      {
        (isSignedIn && <NavLink className="NavLink" to="/signout">Sign out</NavLink>
        ) || <NavLink className="NavLink" to="/signin">Sign in with 42</NavLink>
      }
    </nav>
  );
}

export default Navbar;

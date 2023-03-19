import { Button } from "@mui/material"
import { Link } from "react-router-dom"

interface NavbarLinkProps {
  to: string,
  color: string,
}

const NavbarLink = ({to, color}: NavbarLinkProps): JSX.Element => {
  return (
    <Button sx={{ color: color, padding: 0 }}>
      <Link
        style={{
          all: 'inherit',
          padding: '0.5rem',
          paddingBottom: '1rem',
          paddingTop: '1rem'
        }}
        to={to}
      >
        {to}
      </Link>
    </Button>
  );
}

export default NavbarLink;
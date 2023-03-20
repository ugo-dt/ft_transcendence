// _BottomNavbar.tsx
/**
//  * This is an internal file imported by Navbar.
//  * Do not use directly.
//  */

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import SportsTennisIcon from '@mui/icons-material/SportsTennis';
// import { Link } from 'react-router-dom';
// import { useMediaQuery } from '@mui/material';
// import BottomNavigation from '@mui/material/BottomNavigation';
// import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import Paper from '@mui/material/Paper';
// import HomeIcon from '@mui/icons-material/Home';
// import PeopleIcon from '@mui/icons-material/People';
// import ForumIcon from '@mui/icons-material/Forum';
// import LeaderboardIcon from '@mui/icons-material/Leaderboard';
// import { SvgIconComponent } from '@mui/icons-material';

// interface Page {
//   route: string,
//   icon: SvgIconComponent,
// }

// const pages: Page[] = [
//   {route: 'Home', icon: HomeIcon},
//   {route: 'Play', icon: SportsTennisIcon},
//   {route: 'Rankings', icon: LeaderboardIcon},
//   {route: 'Messages', icon: ForumIcon},
// ]

// const _BottomNavbar = (): JSX.Element => {
//   const mobileScreen = useMediaQuery('(max-width: 750px');
//   const smallIcons = useMediaQuery('(max-width: 350px');
//   const iconSize = smallIcons ? 'small' : 'medium';
//   const [value, setValue] = React.useState(window.location.pathname);
//   const ref = React.useRef<HTMLDivElement>(null);

//   return (
//     <Box ref={ref} sx={{
//       fontSize: '1rem',
//     }}>
//       {mobileScreen &&
//         <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//           <BottomNavigation
//             showLabels
//             value={value}
//             onChange={(event, newValue) => {
//               setValue(newValue);
//             }}
//           >
//             {pages.map((page) => (
//               <BottomNavigationAction
//                 key={page.route}
//                 component={Link}
//                 to={'/' + page.route.toLowerCase()}
//                 label={page.route}
//                 value={'/' + page.route.toLowerCase()}
//                 icon={React.createElement(page.icon, {fontSize: iconSize})} // Create a React component with the correct icon
//               />
//             ))}
//           </BottomNavigation>
//         </Paper>
//       }
//     </Box>
//   );
// }

// export default _BottomNavbar;

// AvatarButton.tsx
import React from "react";
// import { Link } from 'react-router-dom';
// import Tooltip from "@mui/material/Tooltip";
// import IconButton from "@mui/material/IconButton";
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Typography from '@mui/material/Typography';

// const pages = ['Account', 'Sign out'];

// interface AvatarButtonProps {
//   isSignedIn: boolean,
//   avatarImageSrc: string | undefined,
// }

// const AvatarButton = ({ isSignedIn, avatarImageSrc = "" }: AvatarButtonProps): JSX.Element => {
//   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

//   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElUser(event.currentTarget);
//   };
//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   return (
//     <>
//       <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//         <Avatar alt="" src={avatarImageSrc} />
//       </IconButton>
//       <Menu
//         sx={{ mt: '45px' }}
//         id="menu-appbar"
//         anchorEl={anchorElUser}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//         keepMounted
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//         open={Boolean(anchorElUser)}
//         onClose={handleCloseUserMenu}
//       >
//         {(isSignedIn && // Signed in ...
//           pages.map((setting) => (
//             <MenuItem sx={{ padding: '0px' }} key={setting} onClick={handleCloseUserMenu}>
//               <Typography textAlign="center">
//                 <Link
//                   to={'/' + setting.toLowerCase().replaceAll(" ", "")}
//                   style={{ all: 'inherit', padding: '10px' }}
//                 >
//                   {setting}
//                 </Link>
//               </Typography>
//             </MenuItem>
//           ))) ||  // ... or signed out
//           <MenuItem sx={{ padding: '0px' }} onClick={handleCloseUserMenu}>
//             <Typography textAlign="center">
//               <Link to={'/signin'} style={{ all: 'inherit', padding: '10px' }}>Sign in</Link>
//             </Typography>
//           </MenuItem>
//         }
//       </Menu>
//     </>
//   );
// }

// export default AvatarButton;

// Logo.tsx
// import SportsTennisIcon from "@mui/icons-material/SportsTennis";

// interface LogoProps {
//   color?: string | undefined,
//   fontSize?: 'inherit' | 'large' | 'medium' | 'small',
// }

// const Logo = ({color, fontSize = 'inherit'}: LogoProps): JSX.Element => {
//   return (
//     <SportsTennisIcon
//       htmlColor={color}
//       fontSize={fontSize}
//     />
//   );
// }

// export default Logo;

// NavbarLink.tsx
// import { Button } from "@mui/material"
// import { Link } from "react-router-dom"

// interface NavbarLinkProps {
//   to: string,
//   color: string,
// }

// const NavbarLink = ({to, color}: NavbarLinkProps): JSX.Element => {
//   return (
//     <Button sx={{ color: color, padding: 0 }}>
//       <Link
//         style={{
//           all: 'inherit',
//           padding: '0.5rem',
//           paddingBottom: '1rem',
//           paddingTop: '1rem'
//         }}
//         to={to}
//       >
//         {to}
//       </Link>
//     </Button>
//   );
// }

// export default NavbarLink;

// Navbar.tsx

// import { useMediaQuery } from '@mui/material';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Container from '@mui/material/Container';
// import Logo from '../components/Logo';
// import BottomNavbar from '../components/_BottomNavbar'
// import AvatarButton from '../components/AvatarButton';
// import NavbarLink from '../components/NavbarLink';

// const pages = ['Home', 'Play', 'Profile', 'Rankings'];
// const social = ['Friends', 'Messages'];

// /**
//  * 
//  * @param routes Array of strings with the names of the routes.
//  * @param flexGrow flex-grow css attribute for this group of routes.
//  * @returns 
//  */
// const navLinks = (routes: string[]) => {
//   return (
//     <>
//       {routes.map((route) => (
//         <NavbarLink key={route} to={route.toLowerCase()} color={style.textColor} />
//       ))}
//     </>
//   );
// }

// const style = {
//   backgroundColor: "#ffffff",
//   textColor: "black",
//   accentColor: "black",
//   boxShadow: "0 0 8px 2px rgb(0, 0, 0, 0.8)",
//   marginBottom: '10px'
// }

// interface NavbarProps {
//   isSignedIn: boolean,
// }

// function Navbar({ isSignedIn }: NavbarProps) {
//   const mobileScreen = useMediaQuery('(max-width: 750px');

//   return (
//     <>
//       <AppBar position="static" sx={{
//         backgroundColor: style.backgroundColor,
//         color: style.textColor,
//         boxShadow: style.boxShadow,
//         marginBottom: style.marginBottom,
//         maxHeight: '4rem',
//         display: 'flex',
//       }}
//       >
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             <Logo color={style.accentColor} fontSize='large' />
//             {!mobileScreen && navLinks(pages)}
//             <div style={{marginLeft: 'auto'}}>
//               {!mobileScreen && navLinks(social)}
//               <AvatarButton isSignedIn={isSignedIn} avatarImageSrc={undefined}/>
//             </div>
//           </Toolbar>
//         </Container>
//       </AppBar>
//       <BottomNavbar />
//     </>
//   );
// }

// export default Navbar;

import { NavLink } from "react-router-dom";
import BasicMenu from "../components/BasicMenu";

const mainRoutes = ["Home", "Play", "Profile", "Rankings"];
const menuItems = ["Settings", "Sign out"];

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
      <NavLink className={"NavLink nav-right"} to="/friends">Friends</NavLink>
      <NavLink className="NavLink" to="/messages">Messages</NavLink>
      {
        (isSignedIn &&
          <div tabIndex={0}>
            <BasicMenu buttonText="Account" items={menuItems} />
          </div>
        ) || <NavLink className="NavLink" to="/signin">Sign in</NavLink>
      }
    </nav>
  );
}

export default Navbar;

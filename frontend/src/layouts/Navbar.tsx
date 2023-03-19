import * as React from 'react';
import Link from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Logo from '../components/Logo';
import BottomNavbar from '../components/_BottomNavbar'
import AvatarButton from '../components/AvatarButton';
import NavbarLink from '../components/NavbarLink';

const pages = ['Home', 'Play', 'Profile', 'Rankings'];
const social = ['Friends', 'Messages'];

/**
 * 
 * @param routes Array of strings with the names of the routes.
 * @param flexGrow flex-grow css attribute for this group of routes.
 * @returns 
 */
const navLinks = (routes: string[]) => {
  return (
    <>
      {routes.map((route) => (
        <NavbarLink key={route} to={route} color={style.textColor} />
      ))}
    </>
  );
}

const style = {
  backgroundColor: "#ffffff",
  textColor: "black",
  accentColor: "black",
  boxShadow: "0 0 8px 2px rgb(0, 0, 0, 0.8)",
  marginBottom: '10px'
}

interface NavbarProps {isSignedIn: boolean, }

function Navbar({ isSignedIn }: NavbarProps) {
  const mobileScreen = useMediaQuery('(max-width: 750px');

  return (
    <>
      <AppBar position="static" sx={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        boxShadow: style.boxShadow,
        marginBottom: style.marginBottom,
        maxHeight: '4rem',
        display: 'flex',
      }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Logo color={style.accentColor} fontSize='large' />
            {!mobileScreen && navLinks(pages, 1)}
            <div style={{marginLeft: 'auto'}}>
              {!mobileScreen && navLinks(social, 0)}
              <AvatarButton isSignedIn={isSignedIn} avatarImageSrc={undefined}/>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <BottomNavbar />
    </>
  );
}

export default Navbar;
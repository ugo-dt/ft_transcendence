import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';

const pages = ['Home', 'Play', 'Profile', 'Leaderboard'];
const social = ['Friends', 'Messages'];
const settings = ['Settings', 'Sign out'];

const style = {
  backgroundColor: "#ffffff",
  textColor: "black",
  accentColor: "black",
  boxShadow: "0 0 8px 2px rgb(0, 0, 0, 0.8)",
  marginBottom: '10px'
}

const logo = () => {
  return (
    <SportsTennisIcon
      htmlColor={style.accentColor}
      fontSize='large'
      sx={{
        display: 'flex',
        marginLeft: 'auto',
      }}
    />
  );
}

/**
 * 
 * @param routes Array of strings with the names of the routes.
 * @param flexGrow flex-grow css attribute for this group of routes.
 * @returns 
 */
const navLinks = (routes: string[], flexGrow: number) => {
  return (
    <>
      {routes.map((route) => (
        <Button
          // LinkComponent={"a"}
          // href={'/' + route.toLowerCase()}
          key={route}
          sx={{
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            color: style.textColor,
          }}
        >
          <Link style={{ all: 'inherit' }} to={'/' + route.toLowerCase()}>
            {route}
          </Link>
        </Button>
      ))}
    </>
  );
}

const avatarButton = (isSignedIn: boolean) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Tooltip title="Account">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="" /* src="/static/images/avatar/2.jpg" */ />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {(isSignedIn && // Signed in ...
          settings.map((setting) => (
            <MenuItem sx={{ padding: '0px' }} key={setting} onClick={handleCloseUserMenu}>
              <Typography textAlign="center">
                <Link
                  to={'/' + setting.toLowerCase().replaceAll(" ", "")}
                  style={{ all: 'inherit', padding: '10px' }}
                >
                  {setting}
                </Link>
              </Typography>
            </MenuItem>
          ))) ||  // ... or signed out
          <MenuItem sx={{ padding: '0px' }} onClick={handleCloseUserMenu}>
            <Typography textAlign="center">
              <Link to={'/signin'} style={{ all: 'inherit', padding: '10px' }}>Sign in</Link>
            </Typography>
          </MenuItem>
        }
      </Menu>
    </>
  );
}

interface NavbarProps {
  isSignedIn: boolean
}

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
            <Box sx={{ all: 'inherit', flexGrow: 0 }}>{logo()}</Box>
            <Box sx={{ all: 'inherit', display: 'flex' }}>{!mobileScreen && navLinks(pages, 1)}</Box>
            <Box sx={{ all: 'inherit', marginLeft: 'auto', display: 'flex' }}>{!mobileScreen && navLinks(social, 0)}</Box>
            <Box sx={{ marginLeft: mobileScreen ? 'auto' : 0 }}>{avatarButton(isSignedIn)}</Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Navbar;
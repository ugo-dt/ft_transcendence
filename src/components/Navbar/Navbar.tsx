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

const pages = ['Home', 'Play', 'Profile', 'Leaderboard'];
const more_pages = ['Social'];
const settings = ['Settings', 'Sign out'];

const style = {
  backgroundColor: "white",
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
    <Box
      sx={{
        display: 'flex',
        color: style.accentColor,
        flexGrow: flexGrow,
      }}
    >
      {routes.map((route) => (
        <Button
          LinkComponent={"a"}
          href={'/' + route.toLowerCase()}
          key={route}
          sx={{
            paddingLeft: '1rem',
            paddingRight: '1rem',
            my: 1, color: style.textColor,
            display: 'block',
          }}
        >
          {route}
        </Button>
      ))}
    </Box>
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
    <Box sx={{
      color: style.accentColor,
      marginLeft: 'auto',
      flexGrow: 0,
    }}
    >
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
            <MenuItem
              LinkComponent={"a"}
              href={'/' + setting.toLowerCase()}
              key={setting}
              onClick={handleCloseUserMenu}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          ))) ||  // ... or signed out
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{"Sign in"}</Typography>
          </MenuItem>
        }
      </Menu>
    </Box>
  );
}

interface NavbarProps {
  isSignedIn: boolean
}

function Navbar({isSignedIn}: NavbarProps) {
  const mobileScreen = useMediaQuery('(max-width: 600px');

  return (
    <>
      <AppBar position="static" sx={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        boxShadow: style.boxShadow,
        marginBottom: style.marginBottom,
      }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
              {logo()}
              {!mobileScreen && navLinks(pages, 1)}
              {!mobileScreen && navLinks(more_pages, 0)}
              {avatarButton(isSignedIn)}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Navbar;
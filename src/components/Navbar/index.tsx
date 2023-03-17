import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

const pages = ['Home', 'Play', 'Profile', 'Leaderboards'];
const account = ['Account', 'Settings', 'Sign out'];

const style = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "black",
  boxShadow: "0 0 8px 2px rgb(0, 0, 0, 0.8)",
  marginBottom: '10px'
}

function Navbar(props: any) {
  const isSignedIn = props.isSignedIn;

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: style.backgroundColor,
      color: style.textColor,
      boxShadow: style.boxShadow,
      marginBottom: style.marginBottom
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsTennisIcon
            htmlColor={style.accentColor}
            fontSize='large'
            sx={{ display: {xs: 'none', md: 'flex'}, mr: 1 }}
          />

          <Box sx={{ color: style.accentColor, flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
              <Button
                LinkComponent={"a"}
                href={'/' + page.toLowerCase()}
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: style.textColor, display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ color: style.accentColor, flexGrow: 0 }}>
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
              {isSignedIn &&
                account.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))
              }
              {
                !isSignedIn &&
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{"Sign in"}</Typography>
                </MenuItem>
              }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
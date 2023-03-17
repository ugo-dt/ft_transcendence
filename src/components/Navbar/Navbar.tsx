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

function Navbar(props: any) {
  const isSignedIn = props.isSignedIn;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{
      display: { xs: 'none', md: 'flex' },
      backgroundColor: style.backgroundColor,
      color: style.textColor,
      boxShadow: style.boxShadow,
      marginBottom: style.marginBottom,
    }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Logo (normal) */}
          <SportsTennisIcon
            htmlColor={style.accentColor}
            fontSize='large'
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
            }}
          />

          {/* Logo (small) */}
          <SportsTennisIcon
            htmlColor={style.accentColor}
            fontSize='large'
            sx={{
              float: 'left',
              display: { xs: 'flex', md: 'none' },
              mr: 1,
            }}
          />

          {/* Routes (normal) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              color: style.accentColor,
              flexGrow: 1,
            }}
          >
            {pages.map((page) => (
              <Button
                LinkComponent={"a"}
                href={'/' + page.toLowerCase()}
                key={page}
                sx={{
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  my: 2, color: style.textColor,
                  display: 'block',
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Routes (normal) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              color: style.accentColor,
              flexGrow: 0,
            }}
          >
            {more_pages.map((page) => (
              <Button
                LinkComponent={"a"}
                href={'/' + page.toLowerCase()}
                key={page}
                sx={{
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  my: 2, color: style.textColor,
                  display: 'block',
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Account */}
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
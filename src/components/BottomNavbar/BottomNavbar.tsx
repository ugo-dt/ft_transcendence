import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ForumIcon from '@mui/icons-material/Forum';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useMediaQuery } from '@mui/material';

const settings = ['Profile', 'Settings', 'Sign out'];

const style = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "black",
  boxShadow: "0 0 8px 2px rgb(0, 0, 0, 0.8)",
  marginBottom: '10px'
}

function BottomNavbar(props: any) {
  const isSignedIn = props.isSignedIn;
  const current = props.current;

  const showLeaderboard = useMediaQuery('(min-width:350px)');

  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
  }, [value]);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box ref={ref} sx={{
      display: { xs: 'block', md: 'none' },
      fontSize: '1rem',
    }}>
      {/* Account */}
      <Box sx={{
        position: 'absolute',
        margin: '0.5rem',
        top: 0,
        right: 0,
        color: style.accentColor,
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
          {!showLeaderboard && // Small screens show the Leaderboard page in the menu
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">{"Leaderboard"}</Typography>
            </MenuItem>
          }
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
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Play" icon={<SportsTennisIcon />} />
          <BottomNavigationAction label="Social" icon={<ForumIcon />} />
          {showLeaderboard &&
            <BottomNavigationAction label="Leaderboard" icon={<LeaderboardIcon />} />
          }
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default BottomNavbar
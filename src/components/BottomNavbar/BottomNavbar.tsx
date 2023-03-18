import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

const settings = ['Profile', 'Settings', 'Sign out'];

const style = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "black",
  boxShadow: "0 0 8px 2px rgb(0, 0, 0, 0.8)",
  marginBottom: '10px',
}

function BottomNavbar() {
  const mobileScreen = useMediaQuery('(max-width: 600px');
  const smallIcons = useMediaQuery('(max-width: 350px');

  const iconSize = smallIcons ? 'small' : 'medium';

  const [value, setValue] = React.useState(window.location.pathname);
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Box ref={ref} sx={{
      fontSize: '1rem',
    }}>
      {mobileScreen &&
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              component={Link}
              to="/home"
              label="Home"
              value={"/home"}
              icon={<HomeIcon fontSize={iconSize} />}
            />

            <BottomNavigationAction
              component={Link}
              to="/play"
              label="Play"
              value={"/play"}
              icon={<SportsTennisIcon fontSize={iconSize} />}
            />

            <BottomNavigationAction
              component={Link}
              to="/leaderboard"
              label="Leaderboard"
              value={"/leaderboard"}
              icon={<LeaderboardIcon fontSize={iconSize} />}
            />

            <BottomNavigationAction
              component={Link}
              to="/chat"
              label="Chat"
              value={"/chat"}
              icon={<ForumIcon fontSize={iconSize} />}
            />
          </BottomNavigation>
        </Paper>
      }
    </Box>
  );
}

export default BottomNavbar
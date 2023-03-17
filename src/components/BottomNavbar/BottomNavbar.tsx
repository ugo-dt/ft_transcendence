import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import PeopleIcon from '@mui/icons-material/People';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';

const settings = ['Profile', 'Settings', 'Sign out'];

const style = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "black",
  boxShadow: "0 0 8px 2px rgb(0, 0, 0, 0.8)",
  marginBottom: '10px',
}

function BottomNavbar(props: any) {
  const isSignedIn = props.isSignedIn;
  const current = props.current;

  const mobileScreen = useMediaQuery('(max-width: 600px');
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
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Play" icon={<SportsTennisIcon />} />
          {/* {showLeaderboard && */}
            <BottomNavigationAction label="Leaderboard" icon={<LeaderboardIcon />} />
          {/* } */}
          <BottomNavigationAction label="Social" icon={<PeopleIcon />} />
        </BottomNavigation>
      </Paper>
}
    </Box>
  );
}

export default BottomNavbar
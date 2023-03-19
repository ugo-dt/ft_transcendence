/**
 * This is an internal file imported by Navbar.
 * Do not use directly.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { SvgIconComponent } from '@mui/icons-material';

interface Page {
  route: string,
  icon: SvgIconComponent,
}

const pages: Page[] = [
  {route: 'Home', icon: HomeIcon},
  {route: 'Play', icon: SportsTennisIcon},
  {route: 'Rankings', icon: LeaderboardIcon},
  {route: 'Messages', icon: ForumIcon},
]

const _BottomNavbar = (): JSX.Element => {
  const mobileScreen = useMediaQuery('(max-width: 750px');
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
            {pages.map((page) => (
              <BottomNavigationAction
                key={page.route}
                component={Link}
                to={'/' + page.route.toLowerCase()}
                label={page.route}
                value={'/' + page.route.toLowerCase()}
                icon={React.createElement(page.icon, {fontSize: iconSize})} // Create a React component with the correct icon
              />
            ))}
          </BottomNavigation>
        </Paper>
      }
    </Box>
  );
}

export default _BottomNavbar;
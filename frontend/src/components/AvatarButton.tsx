import React from "react";
import { Link } from 'react-router-dom';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const pages = ['Settings', 'Sign out'];

interface AvatarButtonProps {
  isSignedIn: boolean,
  avatarImageSrc: string | undefined,
}

const AvatarButton = ({isSignedIn, avatarImageSrc = ""}: AvatarButtonProps): JSX.Element => {
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
          <Avatar alt="" src={avatarImageSrc} />
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
          pages.map((setting) => (
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

export default AvatarButton;
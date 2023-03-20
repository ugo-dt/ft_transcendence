import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, NavLink } from 'react-router-dom';
import { People } from '@mui/icons-material';

interface NavbarMenuProps {
  buttonText?: string,
  items?: string[],
}

export default function BasicMenu({ buttonText = "", items = [] }: NavbarMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{cursor: 'pointer'}} tabIndex={0}>
      <div onClick={(event: any) => handleClick(event)} className="NavLink">{buttonText}</div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{'aria-labelledby': 'basic-button' }}
        disableAutoFocusItem={true}
      >
        {
          items.map((item) => (
            <MenuItem
              key={item}
              component={Link}
              to={'/' + item.toLowerCase()}
              onClick={handleClose}
            >
              {item}
            </MenuItem>
          ))
        }
      </Menu>
    </div>
  );
}

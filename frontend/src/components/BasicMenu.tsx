import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink } from 'react-router-dom';

import "./style/BasicMenu.css"

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap'
        }}
        className="NavLink button-text"
        onClick={(event: any) => handleClick(event)}
      >
        {buttonText}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="down-arrow-text-icon"
        >
          <path d="M12,16c-0.3,0-0.5-0.1-0.7-0.3l-6-6c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-6,6C12.5,15.9,12.3,16,12,16z"></path>
        </svg>
      </div>
      <Menu
        className='basic-menu'
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
              component={NavLink}
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

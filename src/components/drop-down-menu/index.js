import { Menu, MenuItem } from '@material-ui/core';
import { Typography } from '@mui/material';
import React from 'react';
import useStyles from './styles';

const DropDownMenu = (props) => {
  const { menu, handleCloseMenu, anchorEl, handleItemClick } = props;
  const classes = useStyles();

  return (
    <Menu
      sx={{ mt: '45px' }}
      id="menu-appbar"
      className={classes.menu}
      anchorEl={anchorEl}
      getContentAnchorEl={null}
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
    >
      {
        menu.map((menu, index) => (
          <MenuItem key={index} onClick={() => handleItemClick(menu.path)}>
            { menu.icon }
            <Typography textAlign="center">{menu.name}</Typography>
          </MenuItem>
        ))
      }
      {
        menu.length === 0 ?
          <MenuItem>
            <Typography textAlign="center" fontStyle='italic'>Currently Empty</Typography>
          </MenuItem>
        :
        <div></div>
      }
    </Menu>
  )
}

export default DropDownMenu
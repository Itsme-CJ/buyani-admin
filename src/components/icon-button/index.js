import { Button, Tooltip } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';
import colors from '../../themes/colors';

const IconButton = (props) => {
  const { title, icon, handleClick, color } = props;

  const classes = useStyles();
  return (
    <Tooltip title={title}>
      <Button onClick={handleClick} variant="contained" className={color ? classes.buttonColor : classes.button} color='primary' 
        startIcon={icon}>
      {title}
      </Button>
    </Tooltip>
  )
}

export default IconButton
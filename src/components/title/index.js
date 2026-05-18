import { Typography } from '@material-ui/core';
import React from 'react'
import useStyles from './styles';

const Title = (props) => {
  const { name } = props;
  const classes = useStyles();
  return (
    <Typography className={classes.title} variant='h5'>{name}</Typography>
  )
}

export default Title
import { Box, Grid, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';
import React from 'react';
import useStyles from './styles';


const SkeletonComponent = (props) => {
  const { disabled } = props;
  const classes = useStyles();

  return (
    <Box>
      <Paper className={classes.paper} elevation={3}>
        <Grid container spacing={2} className={classes.form}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Skeleton height={55.972}/>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Skeleton height={55.972}/>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Skeleton height={150.312}/>
          </Grid>
        </Grid>  
        <Grid container className={clsx(disabled ? 'hidden' : classes.action)}>
          <Grid item xs={12} className={`${classes.buttonContainer}`}>
            <Skeleton variant="rect" className={classes.button} />
            <Skeleton variant="rect" className={classes.button} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default SkeletonComponent;


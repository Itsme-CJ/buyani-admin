import { Grid, Typography } from '@material-ui/core';
import { Box, Link, Paper } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router';
import useStyles from './styles';
import { Skeleton } from '@material-ui/lab';

const DashboardTile = (props) => {
  const { icon, title, count, link, isLoading } = props;
  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {
    history.push(link);
  }

  return (
    <Paper className={classes.tile} sx={{ boxShadow: 4 }}>
      <Grid className={classes.content} container spacing={2}>
        <Grid item xl={3} lg={3} md={3} xs={3} sm={3}>
          <img className={classes.background} src={icon} alt={title} />
        </Grid>
        <Grid item xl={9} lg={9} md={9} xs={9} sm={9}>
          <Box className={classes.textContent}>
            <Typography variant='h4' style={{ fontSize: '1.5rem'}}>{title}</Typography>
            {
              isLoading ? 
                <Skeleton variant='text' height={55.972}/>
              :
                <Typography variant='h3'>{count}</Typography>
            }
          </Box>
        </Grid>
      </Grid>
      <Link onClick={handleClick}>View details</Link>
    </Paper>
  )
}

export default DashboardTile
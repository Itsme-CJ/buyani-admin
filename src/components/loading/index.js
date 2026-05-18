import { Container, Paper } from '@mui/material';
import React from 'react';
import useStyles from './styles';

const Loading = () => {
  const classes = useStyles();
  return (
    <Paper classes={classes.paper} style={{marginTop: '16px'}}>
      <Container>
        Loading...
      </Container>
    </Paper>
  )
}

export default Loading
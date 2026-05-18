import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import NavigationBar from '../navigation-bar';
import useStyles from './styles';

const MainLayout = (props) => {
  const { children } = props;

  const classes = useStyles();

  useEffect(() => {
    document.title = `Yearbook`;
  }, []);

  return (
    <>
      <NavigationBar isPublic/>
      <Container className={classes.publicContainer}>
        {
          children
        }
      </Container>
    </>
  )
}

export default MainLayout
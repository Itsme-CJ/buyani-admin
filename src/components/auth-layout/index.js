import { Link } from '@material-ui/core';
import { Box, Container, Paper } from '@mui/material';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import logo from '../../assets/images/logo.png';
import useResponsive from '../../hooks/useResponsive';
import useStyles from './styles';
import backgroundAuthImage from '../../assets/images/auth-background.jpg';

const AuthLayout = (props) => {
  const { children } = props;
  const classes = useStyles();
  const history = useHistory();

  const { pathname } = history.location;
  const { isTabletView, isMobileView } = useResponsive();

  useEffect(() => {
    let title = 'Login';
    if (pathname.includes('forgot')) {
      title = 'Forgot Password';
    } else if (pathname.includes('new')) {
      title = 'Create Password';
    }

    document.title = `BayAni - ${title}`;
  }, [pathname]);

  return (
    <Box className={classes.root}>
      <Box className={classes.backdrop} />
      <img className={classes.background} src={backgroundAuthImage} alt='BayAni Background' />
      <Container className={classes.container}>
      {
        <Paper elevation={6} className={`${classes.paper} ${isTabletView ? classes.tPaper : classes.mPaper } ${!(isTabletView && isMobileView) && classes.lPaper}` }> 
          <img className={classes.logo} src={logo} alt='BayAni Logo' />
          <Box className={`${classes.content} ${classes.mContent} ${pathname.includes('forgot') && classes.forgotPasswordContent }`} >
            {
              children
            }
          </Box>
        </Paper>
      }
      </Container>
      <Box className={classes.footer}>
        <Link>Terms & Condition</Link>
        <Link>Privacy Policy</Link>
      </Box>
    </Box>
  )
}

export default AuthLayout
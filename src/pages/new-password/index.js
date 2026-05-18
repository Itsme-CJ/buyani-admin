import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import useResponsive from '../../hooks/useResponsive';
import { createPasswordSchema } from '../../validation/schema';
import useStyles from './styles';
import api from '../../service/api';
import { API_METHOD } from '../../utility/constant';
import { request } from '../../service/request';

const NewPassword = () => {
  const classes = useStyles();
  const history = useHistory();

  const url       = window.location.href;
  const codeIndex = url.split('/').length - 1;
  const code      = url.split('/')[codeIndex];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPassworError] = useState(false);

  const { isMobileView } = useResponsive();

  const handleResetRequest = () => {
    request({
      url: `${api.NEW_PASSWORD}/${code}`,
      method: API_METHOD.GET,
      params: {
        resendRequest: true,
      }
    }).then(response => {
    }).catch(error => {
      history.push('/portal');
    });
  };

  const initialValues = {
    password     : '',
    confirmPassword  : ''
  }

  const handleCreatePassword = (values, formik) => {
    const { setSubmitting } = formik;

    request({
      url     : api.NEW_PASSWORD,
      method  : API_METHOD.POST,
      data : {
        code         : code,
        newPassword  : values.confirmPassword,
      }
    }).then(() => {
      history.push('/portal');
    }).catch(() => {
    }).finally(() => {
      setSubmitting(false);
    });
  };

  const handleShowPassword = () => {
    setShowPassword(prevValue => !prevValue);
  }

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(prevValue => !prevValue);
  }

  const handleLogin = () => {
    history.push('/portal');
  }

  useEffect(() => {
    // handleResetRequest();
  }, []);

  return (
    <Box className={`${isMobileView ? classes.mLoginContainer: classes.loginContainer}`}>
      <Typography variant='h6'>
        Create Password
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={createPasswordSchema}
        onSubmit={handleCreatePassword}
      >
      {
        formik => (
          <Form>
            <TextField
              fullWidth
              name="password"
              label='Password'
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      id="passwordVisibility"
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              label='Confirm Password'
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="current-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      id="confirmPasswordVisibility"
                      aria-label="toggle confirmPassword visibility"
                      onClick={handleShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />

            <Box textAlign='center'>
              <Button
                id="submitButton"
                type="submit"
                variant="contained"
                color="primary"
                size='medium'
                className={classes.button}
              >
                {
                  formik.isSubmitting ?
                    <CircularProgress color="inherit" size={24}/>
                  :
                    'Submit'
                }
              </Button>
              <Grid container>
              <Grid item className={classes.link}>
                <Link id="activateAccount" onClick={handleLogin} variant="body2" className={classes.textDecor}>
                  Back to Login
                </Link>
              </Grid>
            </Grid>
            </Box>
          </Form>
        )
      }

      </Formik>
    </Box>
  )
}

export default NewPassword
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import useResponsive from '../../hooks/useResponsive';
import { LOGIN } from '../../reducer/AuthReducer';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD, BEARER } from '../../utility/constant';
import { loginSchema } from '../../validation/schema';
import useStyles from './styles';

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  
  const { dispatch: authDispatch } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const { isMobileView } = useResponsive();
  
  const initialValues = {
    email: '',
    password: ''
  };

  const handleSignIn = async (values, formik) => {
    const { email, password } = values;
    const { setSubmitting, setErrors } = formik;

    try {
      const response = await request({
        url: api.LOGIN,
        method: API_METHOD.POST,
        data: {
          email: email,
          password: password
        }
      });

      const { data } = response;
      const userResponse = await getUserByToken(data.accessToken);

      const roleResponse = await request({
        url: api.USER_API + "/role/" + userResponse.data.userId,
        method: API_METHOD.GET,
        headers: {
          Authorization: BEARER + data.accessToken
        }
      });

      authDispatch({
        type: LOGIN,
        payload: {
          token: data,
          user: {
            userId: userResponse.data.userId,
            email: userResponse.data.email,
            firstName: userResponse.data.firstName,
            lastName: userResponse.data.lastName,
            status: userResponse.data.status,
            role: roleResponse.data,
            storeId: userResponse.data.storeId
          }
        }
      });

      history.push('/');
      setSubmitting(false);
    } catch (e) {
      console.log('error', e);
      setErrors({
        email: ' ',
        password: 'Invalid email or password.'
      });
    }
  };

  const getUserByToken = async (token) => {
    return request({
      url: api.USERS_BY_TOKEN,
      method: API_METHOD.GET,
      headers: {
        Authorization: BEARER + token
      }
    });
  };

  const handleShowPassword = () => {
    setShowPassword(prevValue => !prevValue);
  };

  const handleForgotPassword = () => {
    history.push('/forgot-password');
  };

  return (
    <Box className={`${isMobileView ? classes.mLoginContainer : classes.loginContainer}`}>
      
      {/* STYLED BAYANI LOGO TEXT */}
      <Box textAlign="center" mb={0}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            letterSpacing: '2px',
            color: 'primary.main',
          }}
        >
          Bay<span style={{ color: '#4CAF50' }}>Ani</span>
        </Typography>

      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSignIn}
      >
        {(formik) => (
          <Form>
            <TextField
              fullWidth
              id="email"
              label={'Email'}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />

            <TextField
              fullWidth
              name="password"
              label='Password'
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              margin="normal"
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

            <Box textAlign='center' mt={2}>
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
                    <CircularProgress color="inherit" size={24} />
                    :
                    'Login'
                }
              </Button>
            </Box>

            <Grid container justifyContent="center" mt={2}>
              <Grid item className={classes.link}>
                <Link
                  id="forgotPassword"
                  onClick={handleForgotPassword}
                  variant="body2"
                  className={classes.textDecor}
                >
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>

          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
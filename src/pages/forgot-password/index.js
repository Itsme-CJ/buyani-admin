import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router';
import useStyles from './styles';
import { forgotPasswordSchema } from '../../validation/schema';
import useResponsive from '../../hooks/useResponsive';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
import api from '../../service/api';

const ForgotPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  const { isMobileView } = useResponsive();

  const initialValues = {
    email     : '',
  }

  const handleLogin = () => {
    history.push('/');
  }

  const handleForgotPassword = async (values, formik) => {
    const { setSubmitting, setErrors } = formik;

    try {
      await request({
        url     : `${api.RESET_PASSWORD}`,
        method  : API_METHOD.POST,
        data    : {
          email    : values.email
        },
      });

      handleLogin();
    } catch (error) {
      setErrors({
        email : 'Invalid Email Address',
      })
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={`${isMobileView ? classes.mLoginContainer: classes.loginContainer}`}>
      <Typography variant='h6'>
        Forgot Password
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleForgotPassword}
      >
      {
        formik => (
          <Form>
            <TextField
              fullWidth
              id="email"
              label={'Email Address'}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <Box className={classes.buttonContainer} textAlign='center'>
              <Button
                id="back"
                variant="outlined"
                color="primary"
                size='medium'
                onClick={handleLogin}
                className={classes.button}
              >
                Back
              </Button>
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
            </Box>
          </Form>
        )
      }

      </Formik>
    </Box>
  )
}

export default ForgotPassword
import { Box, Button, CircularProgress, Container, Grid, Paper } from '@material-ui/core';
import { TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Select from '../../components/select';
import Title from '../../components/title';
import { AuthContext } from '../../context/AuthContext';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
import { userSchema } from '../../validation/schema';
import SkeletonComponent from './skeleton';
import useStyles from './styles';
import { handleAuditLog, handleInputChange, handleInputNumberChange, isValidPhoneNumber } from '../../utility';

const SystemAdmin = (props) => {
  const { match, notify } = props;
  const { id } = match.params;
  const isCreate = id === 'create';
  
  const classes = useStyles();
  const history = useHistory();
  const { state } = useContext(AuthContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail]         = useState('');
  const [phoneNumber, setPhoneNumber]         = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prevVal, setPrev] = useState(null);

  const initialValues = {
    firstName,
    lastName,
    email,
    phoneNumber
  }

  const handleSubmit =  async(values, formik) => {
    const { setErrors, setSubmitting } = formik;


    let newValues = {
      ...values,
      role: 'ADMIN'
    }
    if (id) {
      newValues = {
        ...values,
        userId: id
      }
    }

    try {
      const response = await request({
        url: id ? `${api.USER_API}/update`: `${api.USER_API}/create` ,
        method: id ? API_METHOD.PATCH: API_METHOD.POST,
        data: newValues,
      })

      const operation = id ? 'updated' : 'created'
      await handleAuditLog(state, id, null, 'developer', operation, prevVal, newValues)

      history.push('/BuyAni/system-admins');
      let message = id ? 'updated' : 'created';

      notify('success', `${response.data.lastName}, ${response.data.firstName} has been ${message} successfully!`);
    } catch(error) {
      if (error?.response?.status === 409) {
        setErrors({
          email: 'Email Address already exist'
        });
      } else {
        notify('error', `Failed to create a system admin!`);
      }
      console.log('ERROR', error)
    } finally {
      setSubmitting(false);
    }

  }

  const handleCancel = () => {
    history.push('/BuyAni/system-admins');
  }

  const handeGetData = async() => {
    setIsLoading(true);
    try {
      const response = await request({
        url: `${api.USERS_API}/${id}`,
        method: API_METHOD.GET,
      })
      const { firstName, email, phoneNumber, lastName } = response.data;
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setPhoneNumber(phoneNumber);

      setPrev({
        firstName, 
        lastName,
        email,
        phoneNumber
      })
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id && !isCreate) {
      handeGetData()
    }
  }, [])

  return (
    <Container className={classes.container}>
      <Title name='Developers'/>
      <Paper className={classes.paper}>
      {
        id && isLoading ?
          <SkeletonComponent />
          : 
          <Formik
            initialValues={initialValues}
            validationSchema={userSchema}
            onSubmit={handleSubmit}
          >
            {
              formik => (
                
                <Form>
                  <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        id="firstName"
                        label={'Firstname*'}
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={handleInputChange(formik, "firstName")}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        id="lastName"
                        label={'Lastname*'}
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={handleInputChange(formik, "lastName")}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        id="email"
                        label={'Email Address*'}
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        id="phoneNumber"
                        label={'Phone Number'}
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        type='number'
                        onChange={isValidPhoneNumber(formik, 'phoneNumber')}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                      />
                    </Grid>
                  </Grid>    
                  <Box textAlign='center' className={`${classes.buttonContainer} 
                  `}>
                    <Button
                      id="cancelButton"
                      onClick={handleCancel} 
                      variant="outlined"
                      color="primary"
                      size='medium'
                      className={classes.button}
                    >
                      Cancel
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
      }
      </Paper>
    </Container>
  )
}

export default SystemAdmin
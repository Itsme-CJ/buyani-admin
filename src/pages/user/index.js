import { Box, Button, CircularProgress, Container, Grid, IconButton, InputAdornment, Paper } from '@material-ui/core';
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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { handleAuditLog, handleInputChange, handleInputNumberChange, isValidPhoneNumber } from '../../utility';

const User = (props) => {
  const { match, notify } = props;
  const { id } = match.params;
  const isCreate = id === 'create';
  
  const generateRandomNumbers = () => {
    let randomNumbers = [];
    for (let i = 0; i < 6; i++) {
        randomNumbers.push(Math.floor(Math.random() * 10)); // Generates numbers between 0 and 99
    }
    return randomNumbers.join('');
  }

  const classes = useStyles();
  const history = useHistory();
  const { state } = useContext(AuthContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail]         = useState('');
  const [phoneNumber, setPhoneNumber]         = useState(null);
  const [role, setRole]  = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState(generateRandomNumbers());
  const [prevVal, setPrev] = useState(null);

  const initialValues = {
    firstName,
    lastName,
    email,
    phoneNumber
  }

  const handleSubmit =  async(values, formik) => {
    const { setErrors, setSubmitting } = formik;

    if (!role) {
      setRoleError('Role is required!');
      return;
    }

  let newValues = {
      ...values,
      storeId: state.user.storeId,
      role: role === 'Cashier' ? 'PCASHIER' : 'PADMIN',
      pin: pin
    }
    if (id) {
      newValues = {
        ...values,
        userId: id,
        storeId: state.user.storeId,
        role: role === 'Cashier' ? 'PCASHIER' : 'PADMIN'
      }
    }

    try {
      const response = await request({
        url: id ? `${api.USER_API}/update`: `${api.USER_API}/create` ,
        method: id ? API_METHOD.PATCH: API_METHOD.POST,
        data: newValues,
      })

      history.push('/BuyAni/users');
      let message = id ? 'updated' : 'created';

      delete newValues.pin

      await handleAuditLog(state, id, state.user.storeId, 'user', message, prevVal, {...newValues, role })

      notify('success', `${response.data.lastName}, ${response.data.firstName} has been ${message} successfully!`);
    } catch(error) {
      if (error?.response?.status === 409) {
        setErrors({
          email: 'Email Address already exist'
        });
      } else {
        notify('error', `Failed to create a user!`);
      }
      console.log('ERROR', error)
    } finally {
      setSubmitting(false);
    }

  }

  const handleCancel = () => {
    history.push('/BuyAni/users');
  }

  const handeGetData = async() => {
    setIsLoading(true);
    try {
      const response = await request({
        url: `${api.USERS_API}/${id}`,
        method: API_METHOD.GET,
      })
      const { firstName, email, phoneNumber, lastName, _links, pin } = response.data;
      const userId = _links.self.href.replace(`${api.USERS_API}/`, '');

      const roleResponse = await request({
        url: api.USER_API + "/role/" + userId,
        method: API_METHOD.GET,
      })

      const { name: roleName } = roleResponse.data;
      let prole = roleName === 'PCASHIER' ? 'Cashier' : 'Admin';
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setRole(prole);
      setPhoneNumber(phoneNumber);

      setPrev({
        firstName, email, phoneNumber, lastName, role: prole
      })

      setPin(pin)
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }

  const handleSelectedProgram = (item) => {
    if (state.user.userId === parseInt(id)) {
      return;
    }
    
    setRole(item.target.value);
    if (!id) {
      setPin(generateRandomNumbers());
    }
  }

  useEffect(() => {
    if (id && !isCreate) {
      handeGetData()
    }
  }, [])

  const handleShowPassword = () => {
    setShowPassword(prevValue => !prevValue);
  }

  return (
    <Container className={classes.container}>
      <Title name='User'/>
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
                        disabled={state.user.userId === parseInt(id)}
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
                        disabled={state.user.userId === parseInt(id)}
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
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Select handleClick={() => {}} error={roleError} menuItem={[{id: 1, name: 'Admin'}, {id:2, name: 'Cashier'}]} label='Role*' value={role} handleChange={handleSelectedProgram}/>
                    </Grid>
                    {
                      role === 'Admin' ?
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            name="pin"
                            label='Pin'
                            disabled
                            type={showPassword ? 'text' : 'password'}
                            id="pin"
                            autoComplete="current-password"
                            value={pin}
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
                          />
                        </Grid>
                      :
                      <></>
                    }
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

export default User
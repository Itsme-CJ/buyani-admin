import { Box, Button, CircularProgress, Container, Grid, IconButton, InputAdornment, Paper, Typography } from '@material-ui/core';
import { TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Title from '../../components/title';
import { AuthContext } from '../../context/AuthContext';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
import { REQUIRED_FIELD, storeSchema } from '../../validation/schema';
import SkeletonComponent from './skeleton';
import useStyles from './styles';
import { handleAuditLog, handleInputChange, handleInputNumberChange, isValidPhoneNumber } from '../../utility';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Store = (props) => {
  const {notify, match} = props;

  const classes = useStyles();
  const history = useHistory();
  const { id } = match.params;
  
  const { state } = useContext(AuthContext);

  const generateRandomNumbers = () => {
    let randomNumbers = [];
    for (let i = 0; i < 6; i++) {
        randomNumbers.push(Math.floor(Math.random() * 10)); // Generates numbers between 0 and 99
    }
    return randomNumbers.join('');
  }

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [firstAddress, setFirstAddress] = useState('');
  const [secondAddress, setSecondAddress] = useState('');
  const [city, setCity] = useState('');
  const [pstate, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState(generateRandomNumbers());
  const [prevVal, setPrev] = useState(null);

  const initialValues = {
    name,
    description,
    firstAddress,
    secondAddress,
    city,
    postalCode,
    phoneNumber,
    email,
    state: pstate,
    userEmail,
    firstName,
    lastName,
    pin
    // pinLocation: '',
  }

  const handleCancel = () => {
    history.push('/BayAni/stores');
  }

  const handleSubmit =  async(values, formik) => {
    const { setSubmitting, setErrors } = formik;
    setErrors({});
    if (!id) {
      if (!values.firstName) {
        setErrors({ firstName: REQUIRED_FIELD });
        return;
      }
  
      if (!values.lastName) {
        setErrors({ lastName: REQUIRED_FIELD });
        return;
      }
      
      if (!values.userEmail) {
        setErrors({ email: REQUIRED_FIELD });
        return;
      }

      if (!values.pin) {
        setErrors({ pin: REQUIRED_FIELD });
        return;
      }
    }

    let newValues = {
      ...values,
      description: values.description,
      user: {
        firstName : values.firstName,
        lastName: values.lastName,
        email: values.userEmail,
        pin: pin
      }
    }

    try {
      const response = await request({
        url: id ? `${api.STORE_API}/${id}`: `${api.STORES_API}/create`,
        method: id ? API_METHOD.PATCH: API_METHOD.POST,
        data: newValues,
      })

      const operation = id ? 'updated' : 'created'
      delete newValues.user
      delete newValues.pin
      await handleAuditLog(state, id, null, 'store', operation, prevVal, newValues)

      if (!id) {
        await request({
          url: `${api.CHAT_ROOM_API}/create`,
          method: API_METHOD.POST,
          data: {
            storeId: response.data.storeId,
            name: 'System Support',
            type: 1
          },
        })
      }
      history.push('/BayAni/stores');
      notify('success', `${response.data.name} has been ${id ? 'updated': 'created'} successfully!`);
    } catch(error) {
      notify('error', `Failed to ${id ? 'update': 'create'} a store! User or Name already exist`);
      console.log('ERROR', error)
    } finally {
      setSubmitting(false);
    }
  }

  const handeGetData = async() => {
    setIsLoading(true);
    try {
      const response = await request({
        url: `${api.STORE_API}/${id}`,
        method: API_METHOD.GET,
      })
      const { name, description, isReservationActivated, firstAddress, secondAddress, city, postalCode, phoneNumber, email, state: pstate } = response.data;
      setName(name)
      setDescription(description)
      setFirstAddress(firstAddress)
      setSecondAddress(secondAddress)
      setCity(city)
      setPostalCode(postalCode)
      setPhoneNumber(phoneNumber)
      setEmail(email)
      setState(pstate)

      setPrev({
        name,
        description,
        firstAddress,
        secondAddress,
        city,
        postalCode,
        phoneNumber,
        email,
        state: pstate,
        userEmail: "",
        firstName: "",
        lastName: '',
        pin: ''
      })

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      handeGetData();
    }
  }, [])

  const handleShowPassword = () => {
    setShowPassword(prevValue => !prevValue);
  }

  return (
    <Container className={classes.container}>
      <Title name={'Store'}/>
      <Paper className={classes.paper}>
      {
      isLoading ?
        <SkeletonComponent />
        : 
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={storeSchema}
            onSubmit={handleSubmit}
          >
          {
            formik => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="name"
                      label={'Name*'}
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      label={'Store Email'}
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
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
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item lg={2} md={2} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="firstAddress"
                      label={'Street'}
                      name="firstAddress"
                      value={formik.values.firstAddress}
                      onChange={handleInputChange(formik, "firstAddress")}
                      error={formik.touched.firstAddress && Boolean(formik.errors.firstAddress)}
                      helperText={formik.touched.firstAddress && formik.errors.firstAddress}
                    />
                  </Grid>
                  <Grid item lg={2} md={2} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="secondAddress"
                      label={'Barangay'}
                      name="secondAddress"
                      value={formik.values.secondAddress}
                      onChange={handleInputChange(formik, "secondAddress")}
                      error={formik.touched.secondAddress && Boolean(formik.errors.secondAddress)}
                      helperText={formik.touched.secondAddress && formik.errors.secondAddress}
                    />
                  </Grid>
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="city"
                      label={'City/Municipality*'}
                      name="city"
                      value={formik.values.city}
                      onChange={handleInputChange(formik, "city")}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      helperText={formik.touched.city && formik.errors.city}
                    />
                  </Grid>
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="state"
                      label={'Province*'}
                      name="state"
                      value={formik.values.state}
                      onChange={handleInputChange(formik, "state")}
                      error={formik.touched.state && Boolean(formik.errors.state)}
                      helperText={formik.touched.state && formik.errors.state}
                    />
                  </Grid>
                  <Grid item lg={2} md={2} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="postalCode"
                      label={'Postal Code*'}
                      name="postalCode"
                      value={formik.values.postalCode}
                      onChange={handleInputChange(formik, "postalCode")}
                      error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                      helperText={formik.touched.postalCode && formik.errors.postalCode}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      id="description"
                      label={'Description'}
                      name="description"
                      value={formik.values.description}
                      onChange={handleInputChange(formik, "description")}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </Grid>
                </Grid>
                {
                  !id ?
                  <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                     <Typography><strong>Initial BayAni Admin </strong></Typography>
                    </Grid>
                    <Grid item lg={3} md={6} sm={12} xs={12}>
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
                    <Grid item lg={3} md={6} sm={12} xs={12}>
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
                    <Grid item lg={3} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        id="email"
                        label={'Email Address*'}
                        name="userEmail"
                        value={formik.values.userEmail}
                        onChange={formik.handleChange}
                        error={formik.touched.userEmail && Boolean(formik.errors.userEmail)}
                        helperText={formik.touched.userEmail && formik.errors.userEmail}
                      />
                    </Grid>
                    <Grid item lg={3} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        name="pin"
                        label='Pin'
                        type={showPassword ? 'text' : 'password'}
                        id="pin"
                        disabled
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
                  </Grid>
                :
                  <></>
                }
                
                <Box textAlign='center' className={classes.buttonContainer}>
                  <Button
                    id="submitButton"
                    onClick={handleCancel} 
                    variant="outlined"
                    color="primary"
                    size='medium'
                    className={classes.button}
                  >
                    Cancel
                  </Button>
                  <Button
                    id="cancelButton"
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
                        `${id ? 'Update' : 'Create'}`
                    }
                  </Button>
                </Box>
              </Form>
            )
          }

          </Formik>
        </>
    }
    </Paper>
  </Container>
  )
}

export default Store
import { Box, Button, CircularProgress, Container, Grid, Paper } from '@material-ui/core';
import { TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Title from '../../components/title';
import { AuthContext } from '../../context/AuthContext';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
import { categorySchema } from '../../validation/schema';
import SkeletonComponent from './skeleton';
import useStyles from './styles';
import { handleAuditLog, handleInputChange } from '../../utility';

const Category = (props) => {
  const { match, notify } = props;
  const { id } = match.params;
  const isCreate = id === 'create';
  
  const { state } = useContext(AuthContext);

  const classes = useStyles();
  const history = useHistory();

  const [name, setName] = useState('');
  const [type, setType]         = useState('');
  const [description, setDescription]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prevVal, setPrev] = useState(null);

  const initialValues = {
    name,
    description,
  }

  const handleSubmit =  async(values, formik) => {
    const { setErrors, setSubmitting } = formik;

    let newValues = {
      ...values,
      storeId: state.user.storeId
    }

    if (id) {
      newValues = {
        ...newValues,
        productCategoryId: id
      }
    }

    try {
      const response = await request({
        url: id ? `${api.PRODUCT_CATEGORY_API}/update`: `${api.PRODUCT_CATEGORY_API}/create` ,
        method: id ? API_METHOD.PATCH: API_METHOD.POST,
        data: newValues,
      })

      history.push('/BuyAni/inventories');
      let message = id ? 'updated' : 'created';
      await handleAuditLog(state, id, state.user.storeId, 'category', message, prevVal, newValues)

      notify('success', `The ${response.data.name} has been ${message} successfully!`);
    } catch(error) {
      if (error?.response?.status === 409) {
        setErrors({
          name: 'Product Category name already exist'
        });
      } else {
        notify('error', `Failed to created a product category!`);
      }
      console.log('ERROR', error)
    } finally {
      setSubmitting(false);
    }
   
    // handleCreate(values, formik);
  }

  const handleCancel = () => {
    history.push('/BuyAni/inventories');
  }

  const handeGetData = async() => {
    setIsLoading(true);
    try {
      const response = await request({
        url: `${api.PRODUCT_CATEGORIES_API}/${id}`,
        method: API_METHOD.GET,
      })
      const { type, name, description } = response.data;
      setType(type);
      setName(name);
      setDescription(description);
      setPrev({type, name, description})
    } catch (e) {

    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    if (id && !isCreate) {
      handeGetData()
    }
    // eslint-disable-next-line
  }, [])

return (
  <Container className={classes.container}>
    <Title name='Category'/>
    <Paper className={classes.paper}>
    {
      id && isLoading ?
        <SkeletonComponent />
        : 
        <Formik
          initialValues={initialValues}
          validationSchema={categorySchema}
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
                      onChange={handleInputChange(formik, "name")}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>
                  {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="type"
                      label={'Type*'}
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      error={formik.touched.type && Boolean(formik.errors.type)}
                      helperText={formik.touched.type && formik.errors.type}
                    />
                  </Grid> */}
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      id="description"
                      label={'Description*'}
                      name="description"
                      value={formik.values.description}
                      onChange={handleInputChange(formik, "description")}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
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

export default Category
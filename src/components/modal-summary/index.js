import React, { useState } from 'react';

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, InputAdornment, Paper, Typography } from '@material-ui/core';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Dialog, TextField } from '@mui/material';
import clsx from 'clsx';
import colors from '../../themes/colors';
import IconButton from '../icon-button';
import useStyles from './styles';


const SummaryComponent = (props) => {
  const { name, data, variant } = props;

  const classes = useStyles();
  return (
    <Box className={classes.summaryCompnent}>
      <Typography variant={variant} style={{ color: colors.PRIMARY}}>{name}:</Typography>
      <Typography variant={variant} style={{ color: colors.PRIMARY}}>{data}</Typography>
    </Box>
  )
}

const CashButton = (props) => {
  const { number, handleCashInput } = props;

  return (
    <Button onClick={() => handleCashInput(number)} variant='contained' style={{flexGrow: 1, background: colors.PRIMARY, width: '140px', height: '100px'}}>
      {number}
    </Button>
  )
}

const CashButtons = ({handleCashInput, handleErase}) => {
  const classes = useStyles();

  return (
    <Box className={classes.buttons} style={{ flex: 1 }}>
      {
        Array.from({ length: 9 }, (_v, index) => (
          <CashButton key={index} number={index + 1} handleCashInput={handleCashInput} />
        ))
      }
      <CashButton number={0} handleCashInput={handleCashInput} />
      <Button onClick={() => handleCashInput(null)} variant='contained' style={{flexGrow: 1, background: colors.ERROR, width: '240px'}}>
        clear
      </Button>
      <IconButton title='' icon={<ArrowBack fontSize='large' />} handleClick={handleErase} />
    </Box>
  )
}

const ModalSummary = (props) => {
  const { open, handleClose, handleSubmit, buttonName, image, title, quantity,
    subTotal, total, finalDiscount, change, discount, value, handleCashInput, handleErase, disabled
   } = props;
  const classes = useStyles();

  const handleChange = (value) => {
    // setValue(value.target.value);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '675px',
            maxWidth: "1100px",  // Set your width here
          },
        },
      }}
    >
      <Paper className={classes.paper}>
        {
          image ?
            <img className={classes.image} src={image} alt='Icon logo' />
          :
            <FontAwesomeIcon className={classes.delete} icon={faExclamationCircle} />
        }
        <Typography className={classes.title} variant='h6'>{title}</Typography>
        <Box className={classes.content}>
          <Grid container spacing={4}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <TextField
                label="Cash"
                fullWidth
                type='number'
                id="outlined-start-adornment"
                className={clsx(classes.margin, classes.textField)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                }}
                value={value}
                onChange={handleChange}
                variant="outlined"
              />
              <CashButtons handleCashInput={handleCashInput} handleErase={handleErase}/>
            </Grid>
            <Grid style={{ padding: '0px', position: 'relative'}} item lg={6} md={6} sm={6} xs={6}>
              <Box className={classes.summaryContainer}>
                  <SummaryComponent name='Item Quantity' data={quantity} variant='p'/>
                  <SummaryComponent name='Subtotal' data={`₱${subTotal}`} variant='p'/>
                  <SummaryComponent name='Discount' data={`-${total ? '₱'+finalDiscount: discount+'%'}`} variant='p'/>
                  <SummaryComponent name='Tax' data={0} variant='p'/>
                  <SummaryComponent name='Total' data={`₱${total}`} variant='h6'/>
                  <SummaryComponent name={'Change'} data={change} variant='p'/>
              </Box>
              <Box textAlign='center' className={classes.buttonContainer} style={{ position: 'absolute', bottom: '20px', }}>
                <Button
                  id="cancelButton"
                  onClick={handleClose} 
                  variant="outlined"
                  color="primary"
                  size='medium'
                  className={classes.button}
                  >
                  Back
                </Button>
                <Button
                  disabled={disabled}
                  id="submitButton"
                  onClick={handleSubmit} 
                  variant="contained"
                  color="primary"
                  size='medium'
                  className={classes.button}
                >
                  
                  { buttonName }
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Dialog>
  )
}

export default ModalSummary
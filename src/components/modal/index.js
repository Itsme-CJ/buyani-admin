import React from 'react';

import { Paper, Typography } from '@material-ui/core';
import { Box, Button, Dialog } from '@mui/material';
import useStyles from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Modal = (props) => {
  const { open, handleClose, handleSubmit, icon, children, buttonName, image, title, isDisabled } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
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
          { children }
        </Box>
        <Box textAlign='center' className={classes.buttonContainer}>
          <Button
            id="cancelButton"
            onClick={handleClose} 
            variant="outlined"
            color="primary"
            size='medium'
            className={classes.button}
            >
            Cancel
          </Button>
          <Button
            disabled={isDisabled}
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
      </Paper>
    </Dialog>
  )
}

export default Modal
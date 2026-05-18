import { Box, Grid, Link, Paper } from '@mui/material';
import React, { useState } from 'react';
import programPic from '../../assets/images/emblem.png';
import useStyles from './styles';
import Modal from '../modal';

const Tile = (props) => {
  const { item, modelContent, handleSubmit, image, id } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  return (
    <>
      <Modal
        open={open} 
        handleClose={handleCloseModal} 
        handleSubmit={() => handleSubmit(id)} 
        buttonName='Submit'
        image={image}
        title={item.name}
      >
        { modelContent }
      </Modal>
      <Grid item xs={4} sm={8} md={3} >
        <Paper className={classes.tile} >
          <Box>
            <img className={classes.programPic} src={programPic} alt='Alumni Placeholder Image' />
          </Box>
          <Link onClick={handleOpen}>{item.name}</Link>
        </Paper>
      </Grid>
    </>
  )
}

export default Tile
import { Container } from '@mui/material';
import React from 'react';
import useStyles from './styles';
import logo from '../../assets/images/no-data.svg'
import { Box } from '@material-ui/core';
import colors from '../../themes/colors';

const Empty = (props) => {
  const { image } = props;
  const classes = useStyles();
  return (
      <Container style={{display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        fontSize: '18px',
        fontWeight: '600',
        marginTop: '80px',
        color: colors.PRIMARY}}>
        <img className={classes.image} src={image ?? logo} alt='Icon logo' style={{ width: '200px'}} />
        Currenty Empty
      </Container>
  )
}

export default Empty
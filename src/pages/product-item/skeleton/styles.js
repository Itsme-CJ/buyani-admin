import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
  },
  form: {
    padding       : theme.spacing(1),
    paddingLeft   : theme.spacing(2),
    paddingRight  : theme.spacing(2),

    '& .MuiSkeleton-root': {
      transform     : 'none',
      marginBottom  : theme.spacing(1)
    },
  },
  loading: {
    borderRadius: theme.spacing(0.4),
    height      : theme.spacing(3.8),
    padding     : theme.spacing(1),
  },
  chipContainer: {
    padding       : theme.spacing(2),
    paddingTop    : theme.spacing(4)
  },
  chipBody : {
    height        : '100%'
  }
  
}));
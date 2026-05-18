import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  actions: {
    display        : 'flex',
    gap            : theme.spacing(1),
    justifyContent : 'center',
    paddingLeft    : 0,
    paddingRight   : 0
  }
}));
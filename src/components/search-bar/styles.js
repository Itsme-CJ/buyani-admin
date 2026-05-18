import { makeStyles } from '@material-ui/core/styles';
import colors from '../../themes/colors';

export default makeStyles((theme) => ({
  searchContainer: {
    '& .MuiInputBase-input':{
      height: '.5em !important'
    },
    '& .MuiOutlinedInput-notchedOutline' : {
      borderColor : colors.PRIMARY + " !important"
    },
    '&:hover > .MuiOutlinedInput-notchedOutline' : {
      borderColor : colors.PRIMARY + " !important"
    }
  },
  nSearchContainer: {
    width: '60%',
  },
  mSearchContainer: {
    width: '100%',
    marginBottom: '8px'
  },
  tSearchContainer: {
    width: '80%',
  },
}))



import { makeStyles } from "@material-ui/core/styles";
import colors from "../../themes/colors";

export default makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    width: '100%',
    maxWidth: '100% !important',
    margin: '0 !important',
    '& .MuiGrid-container': {
      marginTop: theme.spacing(2)
    }
  },
  paper: {
    marginTop: theme.spacing(2),
    backgroundColor: '#ffff',
    paddingTop: theme.spacing(2),
    '& .MuiGrid-container': {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(0),
      marginTop: theme.spacing(0),
    }
  },
  buttonContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#ebebeb78',
    gap: theme.spacing(2),
    '& .MuiButton-containedPrimary': {
      color: colors.WHITE,
      backgroundColor: colors.PRIMARY + ' !important'
    },
    '& .MuiButton-outlinedPrimary': {
      color: colors.PRIMARY + ' !important',
      border: '1px solid '+ colors.PRIMARY + ' !important',
    }
  },
  button: {
    width: theme.spacing(25),
  },
  photoContainer: {
    textAlign: 'center',
    '& .MuiPaper-root': {
      width: '100%',
      height: '340px',
      marginBottom: theme.spacing(2),
    }
  },
  uploadButton: {
    width: '100%',
    color: colors.WHITE,
    backgroundColor: colors.PRIMARY + ' !important'
  }

}))



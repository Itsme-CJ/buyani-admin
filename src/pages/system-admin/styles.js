import { makeStyles } from "@material-ui/core/styles";
import colors from "../../themes/colors";
import { PAGES_STYLE } from "../../themes/common";

export default makeStyles((theme) => ({
  ...PAGES_STYLE,
  formContainer: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  paper: {
    marginTop: theme.spacing(2),
    // backgroundColor: '#ffffff69',
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
  mButtonContainer: {
    justifyContent: 'center'
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
  mPhotoContainer: {
    textAlign: 'center',
    padding: theme.spacing(3) + 'px !important',
    '& .MuiPaper-root': {
      width: '100%',
      height: '340px',
      marginBottom: theme.spacing(2),
      position: 'relative',
      zIndex: '-1'
    }
  },
  uploadButton: {
    width: '100%',
    color: colors.WHITE,
    backgroundColor: colors.PRIMARY + ' !important'
  }
}))



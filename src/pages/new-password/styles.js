import { makeStyles } from "@material-ui/core/styles";
import colors from "../../themes/colors";


export default makeStyles((theme) => ({
  loginContainer: {
    width: theme.spacing(43.75),
    marginTop: '124px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    '& .MuiFormControl-root' : {
      marginBottom: theme.spacing(1.5)
    },
    '& .MuiTypography-h6': {
      fontSize: '1.3rem',
      color: colors.SECONDARY_TEXT
    }
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(1.5)
  },
  link: {
    width : '100%',
    marginBottom: theme.spacing(1.5) + 'px !Important',
    marginTop: theme.spacing(1.5) + 'px !Important',
    '& a' : {
      cursor: 'pointer'
    },
    '& #forgotPassword': {
      alignSelf: 'flex-end'
    }
  },
  mLoginContainer: {
    width: '100%',
    marginTop: '124px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    '& .MuiFormControl-root' : {
      marginBottom: theme.spacing(1.5)
    },
    '& .MuiTypography-h6': {
      fontSize: '1.3rem',
      color: colors.SECONDARY_TEXT
    }
  }
}))
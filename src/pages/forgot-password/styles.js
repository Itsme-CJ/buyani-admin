import { makeStyles } from "@material-ui/core/styles";
import colors from "../../themes/colors";


export default makeStyles((theme) => ({
  loginContainer: {
    width: theme.spacing(43.75),
    marginTop: '96px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    '& .MuiFormControl-root' : {
      marginBottom: theme.spacing(2)
    },
    '& .MuiTypography-root': {
      fontSize: '1.3rem',
      color: colors.SECONDARY_TEXT
    }
  },
  buttonContainer: {
    display: 'flex',
    gap: theme.spacing(1.75)
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  link: {
    width : '100%',
    marginBottom: theme.spacing(2) + 'px !Important',
    marginTop: theme.spacing(2) + 'px !Important',
    '& a' : {
      cursor: 'pointer'
    },
    '& #forgotPassword': {
      alignSelf: 'flex-end'
    }
  },
  mLoginContainer: {
    width: '100%',
    marginTop: '96px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    '& .MuiFormControl-root' : {
      marginBottom: theme.spacing(1.5)
    },
    '& .MuiTypography-root': {
      fontSize: '1.3rem',
      color: colors.SECONDARY_TEXT
    }
  }
}))
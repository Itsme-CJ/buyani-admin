import { makeStyles } from "@material-ui/core/styles";


export default makeStyles((theme) => ({
  loginContainer: {
    width: theme.spacing(43.75),
    marginTop: '150px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    '& .MuiFormControl-root' : {
      marginBottom: theme.spacing(2)
    },
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(2)
  },
  link: {
    width : '100%',
    marginBottom: theme.spacing(1.5) + 'px !Important',
    marginTop: theme.spacing(2) + 'px !Important',
    flexDirection: 'row !important',
    justifyContent: 'center',
    '& a' : {
      cursor: 'pointer'
    },
    '& #forgotPassword': {
      alignSelf: 'flex-end'
    }
  },
  mLoginContainer: {
    marginTop: '128px',
    width: '100%',
    padding: '24px',
    paddingTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    '& .MuiFormControl-root' : {
      marginBottom: theme.spacing(1.5)
    }
  }
}))
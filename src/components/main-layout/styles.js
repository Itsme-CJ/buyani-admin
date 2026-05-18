import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  publicContainer: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height: '90vh',
    overflow: 'scroll',
    width: '100%',
    maxWidth: '100% !important',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5)
  }
}))



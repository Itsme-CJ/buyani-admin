import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  programPic: {
    width: '150px',
    marginBottom: theme.spacing(1)
  },
  tile: {
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    '& a': {
      cursor: 'pointer'
    }
  }
}))



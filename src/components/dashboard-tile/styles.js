import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  tile: {
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    '& a': {
      cursor: 'pointer'
    },
    borderRadius: '16px !important',
    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
  },
  content: {
    padding: '16px',
    margin: 0 + ' !important',
    paddingLeft: '0px',
    '& .MuiGrid-grid-xs-3': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  background: {

  },
  textContent: {

  }
}))



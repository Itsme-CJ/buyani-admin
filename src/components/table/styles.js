import { makeStyles } from '@material-ui/core/styles';
import colors from '../../themes/colors';

export default makeStyles((theme) => ({
  primaryHeader:{
    paddingLeft: 0 + ' !important'
  },
  paper: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#ffffffc2 !important',
    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
  },
  link: {
    color: colors.PRIMARY
  },
  tableSortLabel: {
    fontWeight: '600',
  color: colors.PRIMARY+ ' !important'
  },
  empty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    height: 'fit-content'
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'row',
    '& .MuiButtonBase-root': {
      // paddingLeft: '0px'
    }
    // '& [aria-label="Delete"]:hover' :{
    //   backgroundColor: colors.ERROR,
    //   color: colors.WHITE,
    // },
    // '& [aria-label="Update"]:hover' :{
    //   backgroundColor: colors.PRIMARY,
    //   color: colors.WHITE,
    // }
  },
  actionUpdateButton: {
    marginBottom: '2px',
    backgroundColor: colors.PRIMARY,
    color: colors.WHITE,
    width: 'fit-content',
    '& :hover': {
      backgroundColor: colors.PRIMARY+ ' !important',
      color: colors.WHITE,
    }
  },
  actionDeleteButton: {
    backgroundColor: colors.ERROR,
    color: colors.WHITE,
    width: 'fit-content',
    '& :hover': {
      backgroundColor: colors.ERROR + ' !important',
      color: colors.WHITE,
    }
  },
  actionDisable: {
    marginBottom: '2px',
    width: 'fit-content',
    '&:hover' :{
      backgroundColor: '#e0e0e0 !important',
      color: colors.BLACK + ' !important',
    }
  },
  action: {width: '115px !important', textAlign: 'center !important'},
  outOfStock: {
    color: colors.ERROR + ' !important',
    fontStyle: 'italic'
  },
  italic: {
    fontStyle: 'italic',
    color: colors.SECONDARY_LIGHT
  },
}))



import { makeStyles } from "@material-ui/core/styles";
import colors from "../../themes/colors";
import { PAGES_STYLE } from "../../themes/common";
export default makeStyles((theme) => ({
  ...PAGES_STYLE,
  filter: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'gray',
      width: '150px'
    }
  },
  tabs: {
    marginTop: '16px',
    '& .MuiTabs-indicator': {
      backgroundColor: colors.PRIMARY,
    },
    '& .MuiTab-root': {
      color: colors.PRIMARY_TEXT,
      fontSize: '18px',
      textTransform: 'none',
      fontWeight: '500'
    },

  },
  price: {
    textAlign: 'end'
  },
  list: {
    padding: '0px',
    '& .MuiButtonBase-root' :{
      padding: '0px',
      paddingLeft: '4px',
      paddingRight: '4px',
    },
    '& .MuiListItemButton-root:hover': {
      backgroundColor: colors.SECONDARY_LIGHT
    }
  },
  listTitle: {
    padding: '0px',
    marginTop: '8px',
    '& .MuiButtonBase-root' :{
      padding: '0px',
      paddingLeft: '4px',
      paddingRight: '4px',
    },
    '& .MuiTypography-root': {
      fontWeight: 'bold',
    }
  },
  textField: {
    '& .MuiInputBase-input': {
      padding: '3px'
    }
  },
  tablePaper :{
    marginTop: '16px',
    padding: '0px',
    borderRadius: '4px 4px 0 0',
    border: '0',
    borderBottom: '0.5px solid rgba(224, 224, 224, 1)',
  },
  totalPaper: {
    marginTop: '0px',
    padding: '16px',
    paddingBottom: '20px',
    borderRadius: '0 0 4px 4px',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    '& .MuiBox-root': {
      width: '500px'
    }
  },
  totalCompnent: {
    display: 'flex',
    width: '100% !important',
    justifyContent: 'space-between'
  },
  actionButtons: {
    display: 'flex',
    gap: '4px',
    padding: '16px',
    height: '100%',
    '& .MuiBox-root': {
      width: '100% !important',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      '& .MuiButton-root': {
        minWidth: '150px'
      },
      '& .MuiButton-containedPrimary:nth-child(1)': {
        background: colors.SUCCESS + ' !important',
      },
      '& .MuiButton-containedPrimary:nth-child(2)': {
        background: colors.WARNING + ' !important',
      },
      '& .MuiButton-containedPrimary:nth-child(3)': {
        background: colors.ERROR + ' !important',
      }
    }
  },
  submitContainer: {

  },
  actionSubmit: {
    width: '100% !important',
    minWidth: '100% !important',
    background: colors.PRIMARY + ' !important',
    color: colors.WHITE,
    height: '100%'
  },
  summaryContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& .MuiBox-root': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    }
  },
  margin: {
    margin: theme.spacing(1),
  },
  disabledList: {
    padding: '0px',
    paddingLeft: '4px',
    paddingRight: '4px',
    color: colors.ERROR,
    fontStyle: 'italic',
    '& .MuiButtonBase-root': {
      padding: 0
    }
  }
}))



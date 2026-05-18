import { makeStyles } from "@material-ui/core/styles";
import { PAGES_STYLE } from "../../themes/common";
import colors from "../../themes/colors";
export default makeStyles((theme) => ({
  ...PAGES_STYLE,
  filter: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'gray',
      width: '150px'
    }
  },
  paper: {
    marginTop: '16px',
    padding: '0px',
    backgroundColor: '#ffffffc2 !important',
    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    '& header' :{
      backgroundColor: colors.PRIMARY
    }
  },
  messageRight: {
     overflowX:'unset',
    '& .rce-mbox': {
      background: colors.SECONDARY,
      color: '#ffff',
      width : 'fit-content',
      maxWidth: '60%',

    },
    '& .rce-container-mbox': {
     
    }
  },
  
  messageLeft: {
    overflowX:'unset',
    '& .rce-mbox': {
      width : 'fit-content',
      maxWidth: '60%'
    },
    '& .rce-container-mbox': {
      overflowX:'unset'
    }
  },
  inputForm :{
    width: '100%',
  }

}))




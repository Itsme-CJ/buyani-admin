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
  iconContainerProduct: {
    display: 'flex',
    '& .MuiButton-root': {
      width: '250px',
      marginLeft: '8px'
    }
  }
}))



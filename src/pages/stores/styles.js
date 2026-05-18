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
  }
}))



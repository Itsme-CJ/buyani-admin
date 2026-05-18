import { makeStyles } from "@material-ui/core/styles";
import colors from "../../themes/colors";

export default makeStyles((theme) => ({
  menu: {
    '& .MuiList-root' :{
      padding: theme.spacing(1)
    },
    '& svg': {
      color: colors.PRIMARY,
      marginRight: theme.spacing(2)
    }
  }
}))



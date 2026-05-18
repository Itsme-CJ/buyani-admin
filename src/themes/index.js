import { unstable_createMuiStrictModeTheme as createTheme } from "@mui/material";
import colors from "./colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.PRIMARY,
      dark: colors.PRIMARY,
      light: colors.PRIMARY
    },
    secondary: {
      main: colors.SECONDARY,
      light: colors.SECONDARY_LIGHT,
    },
    error: {
      main: colors.ERROR
    },
    success: {
      main: colors.SUCCESS,
      dark: colors.SUCCESS_DARK,
    },
    text: {
      primary : colors.PRIMARY_TEXT,
      seconday: colors.SECONDARY_TEXT,
    }
  },
  overrides: {
    MuiButton: {
      root: {
        width: 120,
      },
      label: {
        textTransform: 'none'
      }
    },
    MuiPickersToolbarButton: {
      toolbarBtn: {
        width : 'fit-content',
      }
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: colors.PRIMARY_TEXT,
            borderWidth: 1,
          },
        },
      }
    },
    MuiMenu: {
      list: {
        '& .MuiListItem-root.Mui-selected': {
          backgroundColor: colors.PRIMARY
        },
        '& .MuiListItem-root.Mui-selected:hover': {
          backgroundColor: colors.PRIMARY
        },
        '& .MuiListItem-button:hover': {
          backgroundColor: colors.PRIMARY
        }
      }
    },
  },
  props: {
    MuiButton: {
      size : 'medium',
    },
    MuiDialog: {
      disableBackdropClick : true,
      disableEscapeKeyDown : true,
    },
    MuiTextField: {
      margin  : '',
      size    : 'medium',
      variant : 'outlined',
    }
  }
});
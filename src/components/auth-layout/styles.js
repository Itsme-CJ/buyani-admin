import { makeStyles } from "@material-ui/core/styles";
import colors from "../../themes/colors";

export default makeStyles((theme) => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
    position: 'relative'
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: '0px',
    bottom: '0px',
    // background: 'rgb(141 141 141 / 25%)',
    filter: 'blur(200px)',
  },
  background: {
  position: 'fixed',    // fixed to viewport
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  objectFit: 'cover',   // cover whole area without distortion
  zIndex: -1,
},
  container: {
  padding: theme.spacing(0),
  height: '100vh',         // full viewport height
  display: 'flex !important',
  flexDirection: 'column', // vertical stacking
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',    // needed for footer positioning inside container
  paddingBottom: '60px',   // space for footer height
},
  paper: {
		backgroundPosition: 'center', 
		backgroundSize	  : 'contain', 
		backgroundRepeat  : 'no-repeat',
    position: 'relative',
    backgroundColor: colors.SECONDARY_LIGHT + ' !important',
    '& .MuiGrid-item': {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    }
  },
  logoContainer: {
    minHeight: '82px',
    height: '82px',
    position: 'absolute',
    width: '100%',
    background: '#868484',
    opacity: '.3'
  },
  alumniBackgroundImage: {
    width: '100%',
    height: '460px'
  },
  logo: {
    position: 'absolute',
    marginTop: '24px',
    top: '16px',
    width: '160px',
    margin: 'auto',
    left: 0,
    right: 0
  },
  content: {
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiTypography-h4': {
      fontWeight: '600',
      fontSize: '30px',
      textAlign: 'center'
    }
  },
  lPaper: {
    width: '410px !important',
  },
  mPaper : {
    width: '90%',
    height: '500px',
  },
  tPaper : {
    width: '400px',
    height: '485px',
  },
  lContent: {
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiTypography-h4': {
      fontWeight: '600',
      fontSize: '38px'
    }
  },
  mContent: {
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
    '& .MuiTypography-h4': {
      marginTop: '110px'
    }
  },
  forgotPasswordContent: {
    '& .MuiTypography-h3': {
      marginTop: '0px'
    }
  },
  mLogoContainer: {
    left: 0,
    right: 0,
    top: 0
  },
  footer: {
  position: 'absolute',
  bottom: 0,
  padding: '16px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',   // center links horizontally
  gap: '16px',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',  // semi-transparent dark overlay for readability
  color: '#fff',               // white text for visibility
  fontSize: '0.875rem',
  cursor: 'pointer',
  zIndex: 1,
  '& a': {
    color: '#fff',
    textDecoration: 'underline',
    '&:hover': {
      color: '#90caf9',        // light blue on hover
    },
  },
},
}))



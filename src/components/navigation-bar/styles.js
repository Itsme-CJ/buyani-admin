import { makeStyles } from '@material-ui/core/styles';
 
export default makeStyles(() => ({
  topbar: {
    height: '60px',
    background: 'rgba(8, 21, 16, 0.97)',
    borderBottom: '1px solid rgba(125, 255, 155, 0.08)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: '14px',
    flexShrink: 0,
    position: 'relative',
    zIndex: 100,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 1px 20px rgba(0,0,0,0.4)',
  },
 
  /* Logo */
  logoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    flexShrink: 0,
    marginRight: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #1F8A3D, #7DFF9B)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  logoText: {
    fontFamily: 'var(--ba-font-display)',
    fontSize: '18px',
    fontWeight: 800,
    color: 'var(--ba-text)',
    letterSpacing: '0.04em',
    '& span': { color: 'var(--ba-accent)' },
  },
 
  /* Page label */
  pageLabel: {
    fontFamily: 'var(--ba-font-display)',
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--ba-text)',
    lineHeight: 1.1,
  },
  breadcrumb: {
    fontSize: '11px',
    color: 'var(--ba-text3)',
  },
  spacer: { flex: 1 },
 
  /* Search */
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(125,255,155,0.12)',
    borderRadius: '24px',
    padding: '7px 16px',
    width: '220px',
    transition: 'border-color 0.2s',
    '&:focus-within': {
      borderColor: 'rgba(125,255,155,0.3)',
    },
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--ba-text)',
    fontSize: '13px',
    fontFamily: 'var(--ba-font-body)',
    width: '100%',
    '&::placeholder': { color: 'var(--ba-text3)' },
  },
  searchIcon: {
    color: 'var(--ba-text3)',
    fontSize: '15px',
  },
 
  /* Live pill */
  livePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(125,255,155,0.08)',
    border: '1px solid rgba(125,255,155,0.2)',
    borderRadius: '20px',
    padding: '5px 12px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--ba-accent)',
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
 
  /* Icon buttons */
  iconBtn: {
    width: '36px',
    height: '36px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(125,255,155,0.12)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s',
    color: 'var(--ba-text2)',
    '&:hover': {
      background: 'rgba(125,255,155,0.10)',
      borderColor: 'rgba(125,255,155,0.25)',
      color: 'var(--ba-accent)',
    },
    '& svg': { fontSize: '16px' },
  },
  notifDot: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '7px',
    height: '7px',
    background: '#7DFF9B',
    borderRadius: '50%',
    border: '2px solid #081510',
  },
 
  /* Greeting */
  greeting: {
    fontSize: '13px',
    color: 'var(--ba-text2)',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
 
  /* Dropdown */
  dropAnchor: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '10px',
    background: 'rgba(125,255,155,0.06)',
    border: '1px solid rgba(125,255,155,0.12)',
    transition: 'all 0.2s',
    '&:hover': {
      background: 'rgba(125,255,155,0.12)',
    },
  },
  avatarCircle: {
    width: '28px',
    height: '28px',
    background: 'linear-gradient(135deg, #1F8A3D, #7DFF9B)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    color: '#050f08',
    flexShrink: 0,
  },
  dropName: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: 'var(--ba-text)',
  },
 
  /* MUI Menu override */
  menu: {
    '& .MuiPaper-root': {
      background: '#0a1c12',
      border: '1px solid rgba(125,255,155,0.15)',
      borderRadius: '12px',
      marginTop: '8px',
      minWidth: '160px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    },
    '& .MuiMenuItem-root': {
      fontSize: '13px',
      color: 'rgba(200,240,210,0.7)',
      gap: '10px',
      padding: '10px 16px',
      transition: 'all 0.15s',
      '&:hover': {
        background: 'rgba(125,255,155,0.08)',
        color: '#7DFF9B',
      },
    },
  },
}));
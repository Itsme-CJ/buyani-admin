import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { Menu, MenuItem } from '@material-ui/core';
import { AuthContext } from '../../context/AuthContext';
import { LOGOUT } from '../../reducer/AuthReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faGear,
  faSignOut,
  faUserEdit,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import useResponsive from '../../hooks/useResponsive';
import useStyles from './styles';
 
/* ── Live dot ─────────────────────────────────────────── */
const LiveDot = () => (
  <span className="ba-live-dot" aria-hidden="true" />
);
 
/* ── Component ──────────────────────────────────────────── */
const NavigationBar = ({ isProfile, notify }) => {
  const classes = useStyles();
  const history = useHistory();
  const { dispatch: authDispatch, state } = useContext(AuthContext);
  const { user } = state;
  const { isMobileView } = useResponsive();
 
  const [anchorEl, setAnchorEl] = useState(null);
 
  /* Derive page label from pathname */
  const { pathname } = history.location;
  const PAGE_LABELS = {
    dashboard:            'Dashboard',
    'pending-applications': 'Pending Sellers',
    'manage-users':       'Manage Users',
    'manage-sellers':     'Manage Sellers',
    orders:               'Orders',
    inventories:          'Products',
    analytics:            'Analytics',
    reports:              'Reports',
    settings:             'Settings',
    'system-admins':      'Developers',
    stores:               'Stores',
    profile:              'Profile',
  };
  const segment = pathname.split('/').pop();
  const pageLabel = PAGE_LABELS[segment] ?? 'BuyAni';
  const breadcrumb = `BuyAni / ${pageLabel}`;
 
  /* Handlers */
  const signOut = () => {
    authDispatch({ type: LOGOUT });
  };
 
  const handleMenuClick = (path) => {
    setAnchorEl(null);
    if (path === '/') { signOut(); return; }
    if (path.includes('profile')) {
      notify?.('success', 'Profile page coming soon');
      return;
    }
    history.push(path);
  };
 
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'AD';
 
  return (
    <header className={classes.topbar}>
      {/* Logo (mobile only) */}
      {isMobileView && (
        <div className={classes.logoBtn} onClick={() => history.push('/')}>
          <div className={classes.logoIcon}>🌾</div>
          <div className={classes.logoText}>Buy<span>Ani</span></div>
        </div>
      )}
 
      {/* Page label (desktop only) */}
      {!isMobileView && (
        <div>
          <div className={classes.pageLabel}>{pageLabel}</div>
          <div className={classes.breadcrumb}>{breadcrumb}</div>
        </div>
      )}
 
      <div className={classes.spacer} />
 
      {/* Live pill */}
      {!isMobileView && (
        <div className={classes.livePill}>
          <LiveDot />
          Live
        </div>
      )}
 
      {/* Notification bell */}
      <div
        className={classes.iconBtn}
        onClick={() => notify?.('success', 'Notifications coming soon')}
        role="button"
        tabIndex={0}
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} />
        <span className={classes.notifDot} aria-hidden="true" />
      </div>
 
      {/* Profile dropdown trigger */}
      <div
        className={classes.dropAnchor}
        onClick={e => setAnchorEl(e.currentTarget)}
        role="button"
        tabIndex={0}
        aria-label="Profile menu"
      >
        <div className={classes.avatarCircle}>{initials}</div>
        {!isMobileView && (
          <span className={classes.dropName}>
            {user?.firstName ?? 'Admin'}
          </span>
        )}
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{ fontSize: '10px', color: 'var(--ba-text3)' }}
        />
      </div>
 
      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className={classes.menu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleMenuClick('/BuyAni/profile')}>
          <FontAwesomeIcon icon={faUserEdit} style={{ width: '16px' }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick('/BuyAni/settings')}>
          <FontAwesomeIcon icon={faGear} style={{ width: '16px' }} />
          Settings
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick('/')}>
          <FontAwesomeIcon
            icon={faSignOut}
            style={{ width: '16px', color: '#f87171' }}
          />
          <span style={{ color: '#f87171' }}>Logout</span>
        </MenuItem>
      </Menu>
    </header>
  );
};
 
export default NavigationBar;
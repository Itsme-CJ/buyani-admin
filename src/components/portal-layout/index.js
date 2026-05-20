import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import useResponsive from '../../hooks/useResponsive';
import NavigationBar from '../navigation-bar';
import useStyles from './styles';
import '../../themes/bayani.css';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
 
/* ── Icons (FontAwesome kept for compatibility) ─────────── */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableCellsLarge,
  faStore,
  faUsers,
  faStoreAlt,
  faGear,
  faShoppingCart,
  faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
 
/* ── Nav menu definitions ───────────────────────────────── */
const MENU_PADMIN = (pendingCount) => [
  { name: 'Dashboard',         path: '/BuyAni/dashboard',            icon: faTableCellsLarge, label: 'Main' },
  { name: 'Pending Sellers',   path: '/BuyAni/pending-applications', icon: faStore,           label: null, badge: pendingCount > 0 ? String(pendingCount) : null },
  { name: 'Manage Users',      path: '/BuyAni/manage-users',         icon: faUsers,           label: null },
  { name: 'Manage Sellers',    path: '/BuyAni/manage-sellers',       icon: faStoreAlt,        label: 'Commerce' },
  { name: 'Settings',          path: '/BuyAni/settings',             icon: faGear,            label: null },
];
 
const MENU_ADMIN = [
  { name: 'Developers',        path: '/BuyAni/system-admins',        icon: faUsersGear,       label: 'Main' },
  { name: 'Stores',            path: '/BuyAni/stores',               icon: faStoreAlt,        label: null },
  { name: 'Manage Users',      path: '/BuyAni/manage-users',         icon: faUsers,           label: null },
  { name: 'Manage Sellers',    path: '/BuyAni/manage-sellers',       icon: faStoreAlt,        label: null },
];
 
/* ── Component ──────────────────────────────────────────── */
const PortalLayout = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();
  const { state } = useContext(AuthContext);
  const { user } = state;
  const { pathname } = history.location;
 
  const { isMobileView, isTabletView } = useResponsive();
  const isResponsive = isMobileView || isTabletView;
  const isProfile = pathname.includes('profile');
 
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await request({
        url: api.STORE_API + '/search/findByStatus',
        method: API_METHOD.GET,
        params: { status: 'PENDING' },
      });
      const stores = res.data?._embedded?.stores ?? res.data ?? [];
      const list = Array.isArray(stores) ? stores : [];
      setPendingCount(list.length);
    } catch (e) { /* silent */ }
  }, []);

  useEffect(() => {
    if (user.role.name === 'PADMIN') fetchPendingCount();
  }, [user.role.name, fetchPendingCount]);

  /* Pick menu list by role */
  const menu =
    user.role.name === 'ADMIN'    ? MENU_ADMIN :
    user.role.name === 'PCASHIER' ? []         : MENU_PADMIN(pendingCount);
 
  /* Toast helper (passed down to NavigationBar) */
  const notify = (type, message) => {
    const opt = {
      position: 'top-right', autoClose: 5000, hideProgressBar: false,
      closeOnClick: true, pauseOnHover: true, draggable: true,
      theme: 'colored', transition: Bounce,
    };
    type === 'success' ? toast.success(message, opt) : toast.error(message, opt);
  };
 
  /* Sync selected index & document title with current path */
  useEffect(() => {
    const idx = menu.findIndex(m => pathname.includes(m.path.split('/').pop()));
    setSelectedIndex(idx >= 0 ? idx : 0);
    const active = menu.find(m => pathname.includes(m.path.split('/').pop()));
    document.title = `BuyAni - ${active?.name ?? 'Dashboard'}`;
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
 
  const handleNavClick = (index, path) => {
    setSelectedIndex(index);
    history.push(path);
  };
 
  /* ── Render: hide sidebar on mobile/profile pages ─────── */
  const showSidebar = !isResponsive && !isProfile;
 
  return (
    <div className={classes.shell} style={{ background: 'var(--ba-bg)' }}>
      <ToastContainer />
 
      {/* ── Sidebar ────────────────────────────────────── */}
      {showSidebar && (
        <aside className={classes.sidebar}>
          {/* Logo */}
          <div className={classes.logoWrap}>
            <div className={classes.logoInner}>
              <div className={classes.logoIcon}>🌾</div>
              <div className={classes.logoTextWrap}>
                <div className={classes.logoText}>
                  Buy<span>Ani</span>
                </div>
                <div className={classes.logoSub}>Admin Portal</div>
              </div>
            </div>
          </div>
 
          {/* Nav items */}
          <nav className={classes.nav}>
            {menu.map((item, index) => (
              <React.Fragment key={item.path}>
                {item.label && (
                  <div className={classes.navLabel}>{item.label}</div>
                )}
                <div
                  className={`${classes.navItem} ${selectedIndex === index ? classes.navItemActive : ''}`}
                  onClick={() => handleNavClick(index, item.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleNavClick(index, item.path)}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ width: '20px' }} />
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.badge && (
                    <span className={classes.navBadge}>{item.badge}</span>
                  )}
                </div>
              </React.Fragment>
            ))}
          </nav>
 
          {/* Admin chip */}
          <div className={classes.sidebarFooter}>
            <div className={classes.adminChip}>
              <div className={classes.adminAvatar}>
                {(user?.firstName?.[0] ?? 'A').toUpperCase()}
              </div>
              <div className={classes.adminInfo}>
                <div className={classes.adminName}>
                  {user?.firstName} {user?.lastName}
                </div>
                <div className={classes.adminRole}>{user?.role?.name}</div>
              </div>
            </div>
          </div>
        </aside>
      )}
 
      {/* ── Main area ──────────────────────────────────── */}
      <div className={classes.mainArea}>
        <NavigationBar isProfile={isProfile} notify={notify} />
        <div className={`${isResponsive ? classes.mobileContent : classes.content} ba-scroll`}>
          {children}
        </div>
      </div>
    </div>
  );
};
 
export default PortalLayout;
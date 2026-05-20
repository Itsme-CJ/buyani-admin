import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
import useStyles from './styles';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Title as ChartTitle,
  Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faCertificate, faClock,
  faArrowTrendUp, faArrowRight,
  faUserCheck, faTimes,
  faChartLine, faStore,
} from '@fortawesome/free-solid-svg-icons';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  ChartTitle, Tooltip, Legend, Filler,
);

/* ── Constants ──────────────────────────────────────────── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const EMPTY12 = Array(12).fill(0);

/* ── Live dot ───────────────────────────────────────────── */
const LiveDot = () => <span className="ba-live-dot" aria-hidden="true" />;

/* ── Animated counter hook ──────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!target) { setDisplay(0); return; }
    let frame = 0;
    const total = 60;
    const step = target / total;
    const t = setInterval(() => {
      frame++;
      setDisplay(prev => {
        const next = Math.min(prev + step, target);
        if (frame >= total) { clearInterval(t); return target; }
        return next;
      });
    }, duration / total);
    return () => clearInterval(t);
  }, [target, duration]);
  return Math.round(display);
}

/* ── Mini sparkbar ──────────────────────────────────────── */
const MiniBars = ({ data, color }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '32px', marginTop: '14px' }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(4, Math.round((v / max) * 32))}px`,
            borderRadius: '3px',
            background: i === data.length - 1
              ? color ?? 'rgba(125,255,155,0.6)'
              : 'rgba(125,255,155,0.1)',
            transition: 'height 0.3s',
          }}
        />
      ))}
    </div>
  );
};

/* ── Status pill ────────────────────────────────────────── */
const PILL_STYLES = {
  APPROVED: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
  PENDING:  { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  REJECTED: { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
};
const StatusPill = ({ status }) => {
  const s = PILL_STYLES[status?.toUpperCase()] ?? PILL_STYLES.PENDING;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {status}
    </span>
  );
};

/* ── Stat card ──────────────────────────────────────────── */
const CARD_THEMES = {
  green: {
    glow: '#1F8A3D',
    iconBg: 'rgba(31,138,61,0.25)',  iconColor: '#4ade80',
    badgeBg: 'rgba(74,222,128,0.12)', badgeColor: '#4ade80',
    barColor: 'rgba(125,255,155,0.6)',
    shadow: 'rgba(31,138,61,0.18)',
  },
  teal: {
    glow: '#0f766e',
    iconBg: 'rgba(15,118,110,0.25)', iconColor: '#2dd4bf',
    badgeBg: 'rgba(74,222,128,0.12)', badgeColor: '#4ade80',
    barColor: 'rgba(45,212,191,0.6)',
    shadow: 'rgba(15,118,110,0.18)',
  },
  amber: {
    glow: '#d97706',
    iconBg: 'rgba(217,119,6,0.25)',  iconColor: '#fbbf24',
    badgeBg: 'rgba(251,191,36,0.12)', badgeColor: '#fbbf24',
    barColor: 'rgba(251,191,36,0.5)',
    shadow: 'rgba(217,119,6,0.18)',
  },
};

const StatCard = ({ theme = 'green', icon, value, label, badge, badgeIcon, sparkData, prefix = '', animDelay = 0 }) => {
  const t = CARD_THEMES[theme];
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="ba-fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(12,30,18,0.92)',
        border: `1px solid ${hovered ? 'rgba(125,255,155,0.3)' : 'rgba(125,255,155,0.15)'}`,
        borderRadius: '18px',
        padding: '24px 26px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(125,255,155,0.1)`
          : `0 4px 20px rgba(0,0,0,0.35), 0 1px 0 rgba(125,255,155,0.08) inset`,
        animationDelay: `${animDelay}ms`,
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '-10px', right: '-10px',
        width: '100px', height: '100px', borderRadius: '50%',
        filter: 'blur(40px)', opacity: hovered ? 0.8 : 0.5,
        background: t.glow, pointerEvents: 'none',
        transition: 'opacity 0.25s',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px', position: 'relative' }}>
        {/* Icon */}
        <div style={{
          width: '46px', height: '46px', borderRadius: '13px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: t.iconBg, color: t.iconColor, fontSize: '20px',
          boxShadow: `0 2px 8px ${t.shadow}`,
        }}>
          <FontAwesomeIcon icon={icon} />
        </div>
        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 700,
          padding: '4px 10px', borderRadius: '20px',
          background: t.badgeBg, color: t.badgeColor,
          border: `1px solid ${t.badgeBg}`,
        }}>
          {badgeIcon && <FontAwesomeIcon icon={badgeIcon} style={{ fontSize: '10px' }} />}
          {badge}
        </div>
      </div>

      <div style={{
        fontFamily: 'var(--ba-font-display)',
        fontSize: '32px', fontWeight: 800,
        color: 'var(--ba-text)', lineHeight: 1, marginBottom: '6px',
        position: 'relative',
      }}>
        {prefix}{value.toLocaleString()}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--ba-text3)', fontWeight: 500 }}>{label}</div>

      <MiniBars data={sparkData} color={t.barColor} />
    </div>
  );
};

/* ── Chart shared config ────────────────────────────────── */
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(8,21,16,0.95)',
      borderColor: 'rgba(125,255,155,0.2)',
      borderWidth: 1,
      titleColor: '#7DFF9B',
      bodyColor: 'rgba(200,240,210,0.8)',
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(125,255,155,0.04)' },
      ticks: { color: 'rgba(150,200,165,0.55)', font: { size: 10, family: "'DM Sans', sans-serif" } },
    },
    y: {
      grid: { color: 'rgba(125,255,155,0.04)' },
      ticks: { color: 'rgba(150,200,165,0.55)', font: { size: 10, family: "'DM Sans', sans-serif" } },
    },
  },
};

/* ═══════════════════════════════════════════════════════════
   Dashboard Component
═══════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const { state } = useContext(AuthContext);

  /* ── State ────────────────────────────────────────────── */
  const [totalCustomer,         setTotalCustomer]         = useState(0);
  const [verifiedSellers,       setVerifiedSellers]       = useState(0);
  const [pendingCount,          setPendingCount]          = useState(0);
  const [customerMonthlyData,   setCustomerMonthlyData]   = useState(EMPTY12);
  const [verifiedSellerMonthly, setVerifiedSellerMonthly] = useState(EMPTY12);
  const [pendingApplications,   setPendingApplications]   = useState([]);

  /* Animated hero counters */
  const heroFarmers = useCountUp(verifiedSellers);
  const heroPending = useCountUp(pendingCount);

  /* Animated stat counters */
  const cCustomer = useCountUp(totalCustomer);
  const cSellers  = useCountUp(verifiedSellers);
  const cPending  = useCountUp(pendingCount);

  /* ── Data fetching ────────────────────────────────────── */
  const fetchMonthlyStats = useCallback(async () => {
    try {
      const res = await request({ url: api.USER_API + '/monthly-stats', method: API_METHOD.GET });
      const d = res.data;
      if (d.customers) {
        setCustomerMonthlyData(d.customers);
        setTotalCustomer(d.customers.reduce((s, n) => s + n, 0));
      }
    } catch (e) { console.error('Monthly stats:', e); }
  }, []);

  const fetchVerifiedSellers = useCallback(async () => {
    try {
      const res = await request({
        url: api.STORE_API + '/search/findByStatus',
        method: API_METHOD.GET,
        params: { status: 'APPROVED' },
      });
      const stores = res.data?._embedded?.stores ?? res.data ?? [];
      const list = Array.isArray(stores) ? stores : [];
      setVerifiedSellers(list.length);
      const monthly = Array(12).fill(0);
      list.forEach(s => {
        const m = s.whenAdded ? new Date(s.whenAdded).getMonth() : -1;
        if (m >= 0) monthly[m]++;
      });
      setVerifiedSellerMonthly(monthly);
    } catch (e) { console.error('Verified sellers:', e); }
  }, []);

  const fetchPendingApplications = useCallback(async () => {
    try {
      const res = await request({
        url: api.STORE_API + '/search/findByStatus',
        method: API_METHOD.GET,
        params: { status: 'PENDING' },
      });
      const stores = res.data?._embedded?.stores ?? res.data ?? [];
      const list = Array.isArray(stores) ? stores : [];
      setPendingCount(list.length);
      setPendingApplications(list.slice(0, 5));
    } catch (e) { console.error('Pending applications:', e); }
  }, []);

  useEffect(() => {
    fetchMonthlyStats();
    fetchVerifiedSellers();
    fetchPendingApplications();
  }, [fetchMonthlyStats, fetchVerifiedSellers, fetchPendingApplications]);

  /* ── Chart data ───────────────────────────────────────── */
  const growthChartData = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Customers',
        data: customerMonthlyData,
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74,222,128,0.06)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Sellers',
        data: verifiedSellerMonthly,
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45,212,191,0.06)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  /* ── Spark data ───────────────────────────────────────── */
  const SPARK_CUSTOMERS = [20,35,28,42,38,55,48,62,57,70,65, totalCustomer || 80];
  const SPARK_SELLERS   = [5,8,12,9,15,18,14,22,19,25,28, verifiedSellers || 30];
  const SPARK_PENDING   = [8,12,6,14,10,8,16,12,18,14,20, pendingCount || 2];

  /* ── Live activity items built from real data ─────────── */
  const activityItems = [
    {
      icon: faUsers,
      iconTheme: { bg: 'rgba(31,138,61,0.2)', color: '#4ade80' },
      title: `${totalCustomer} total customer${totalCustomer !== 1 ? 's' : ''} registered`,
      time: 'All time',
    },
    {
      icon: faCertificate,
      iconTheme: { bg: 'rgba(15,118,110,0.2)', color: '#2dd4bf' },
      title: `${verifiedSellers} seller${verifiedSellers !== 1 ? 's' : ''} verified`,
      time: 'All time',
    },
    ...pendingApplications.map(store => ({
      icon: faClock,
      iconTheme: { bg: 'rgba(217,119,6,0.2)', color: '#fbbf24' },
      title: `${store.name ?? store.storeName ?? 'Unknown'} — pending approval`,
      time: store.whenAdded
        ? `${new Date(store.whenAdded).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}${store.address ?? store.location ? ` — ${store.address ?? store.location}` : ''}`
        : '—',
    })),
    pendingApplications.length === 0 && {
      icon: faStore,
      iconTheme: { bg: 'rgba(125,255,155,0.1)', color: '#7DFF9B' },
      title: 'No pending seller applications',
      time: 'All caught up',
    },
    {
      icon: pendingCount > 0 ? faTimes : faUserCheck,
      iconTheme: pendingCount > 0
        ? { bg: 'rgba(248,113,113,0.1)', color: '#f87171' }
        : { bg: 'rgba(31,138,61,0.2)', color: '#4ade80' },
      title: pendingCount > 0
        ? `${pendingCount} application${pendingCount !== 1 ? 's' : ''} awaiting review`
        : 'All applications reviewed',
      time: 'Current status',
    },
  ].filter(Boolean);

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className={classes.root}>

      {/* ── Hero banner ─────────────────────────────── */}
      <div className={classes.hero}>
        <div className={classes.heroGrid} />
        <div className={classes.heroContent}>
          <div className={classes.heroEyebrow}>
            <LiveDot /> System Active
          </div>
          <h1 className={classes.heroTitle}>
            Welcome back, <span>Admin</span> 👋
          </h1>
          <p className={classes.heroSub}>
            Monitor farmer registrations, approve sellers, and track rice marketplace
            activity across the Philippines.
          </p>
          <div className={classes.heroBtns}>
            <button
              className={classes.btnPrimary}
              onClick={() => history.push('/BuyAni/reports')}
            >
              <FontAwesomeIcon icon={faChartLine} />
              View Reports
            </button>
            <button
              className={classes.btnGhost}
              onClick={() => history.push('/BuyAni/pending-applications')}
            >
              <FontAwesomeIcon icon={faUserCheck} />
              Approve Sellers
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────── */}
      <div className={classes.statsGrid}>
        <StatCard
          theme="green"  icon={faUsers}       label="Total Customers"
          value={cCustomer}  badge="+12%"  badgeIcon={faArrowTrendUp}
          sparkData={SPARK_CUSTOMERS}  animDelay={0}
        />
        <StatCard
          theme="teal"   icon={faCertificate} label="Verified Sellers"
          value={cSellers}   badge="+8%"   badgeIcon={faArrowTrendUp}
          sparkData={SPARK_SELLERS}    animDelay={60}
        />
        <StatCard
          theme="amber"  icon={faClock}       label="Pending Approvals"
          value={cPending}   badge={`${pendingCount} new`}
          sparkData={SPARK_PENDING}    animDelay={120}
        />
      </div>

      {/* ── Chart + Activity row ─────────────────────── */}
      <div className={classes.chartsRow}>
        {/* Growth line chart */}
        <div className={classes.chartCard}>
          <div className={classes.chartHeader}>
            <div>
              <div className={classes.chartTitle}>Customer &amp; Seller Growth</div>
              <div className={classes.chartSub}>Monthly breakdown — {new Date().getFullYear()}</div>
            </div>
            <div className={classes.chartLegend}>
              <div className={classes.legendItem}>
                <div className={classes.legendDot} style={{ background: '#4ade80' }} />
                Customers
              </div>
              <div className={classes.legendItem}>
                <div className={classes.legendDot} style={{ background: '#2dd4bf' }} />
                Sellers
              </div>
            </div>
          </div>
          <div className={classes.chartArea}>
            <Line data={growthChartData} options={CHART_DEFAULTS} />
          </div>
        </div>

        {/* Live activity feed */}
        <div className={classes.activityCard}>
          <div className={classes.sectionHeader}>
            <div className={classes.sectionTitle}>Live Activity</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(125,255,155,0.08)',
              border: '1px solid rgba(125,255,155,0.2)',
              borderRadius: '20px', padding: '3px 8px',
              fontSize: '10px', fontWeight: 600, color: 'var(--ba-accent)',
            }}>
              <LiveDot /> Now
            </div>
          </div>
          <div className={classes.activityList}>
            {activityItems.map((a, i) => (
              <div key={i} className={classes.activityItem}>
                <div className={classes.actIcon} style={{ background: a.iconTheme.bg, color: a.iconTheme.color }}>
                  <FontAwesomeIcon icon={a.icon} style={{ fontSize: '13px' }} />
                </div>
                <div className={classes.actText}>
                  <div className={classes.actTitle}>{a.title}</div>
                  <div className={classes.actTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pending seller applications table ───────── */}
      <div className={classes.tableCard}>
        <div className={classes.sectionHeader}>
          <div className={classes.sectionTitle}>Pending Seller Applications</div>
          <div
            className={classes.seeAll}
            onClick={() => history.push('/BuyAni/pending-applications')}
            role="button" tabIndex={0}
          >
            View all <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px' }} />
          </div>
        </div>
        <table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.th}>Farmer</th>
              <th className={classes.th}>Location</th>
              <th className={classes.th}>Submitted</th>
              <th className={classes.th} style={{ textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingApplications.length > 0
              ? pendingApplications.map((store, i) => {
                  const name     = store.name ?? store.storeName ?? 'Unknown';
                  const initials = name.slice(0, 2).toUpperCase();
                  const date     = store.whenAdded
                    ? new Date(store.whenAdded).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
                    : '—';
                  return (
                    <tr key={i}>
                      <td className={classes.td}>
                        <span className={classes.sellerAv}>{initials}</span>
                        {name}
                      </td>
                      <td className={classes.td}>{store.address ?? store.location ?? '—'}</td>
                      <td className={classes.td}>{date}</td>
                      <td className={classes.td} style={{ textAlign: 'right' }}>
                        <StatusPill status={store.status ?? 'PENDING'} />
                      </td>
                    </tr>
                  );
                })
              : (
                <tr>
                  <td className={classes.td} colSpan={4} style={{ textAlign: 'center', color: 'var(--ba-text3)', padding: '24px 0' }}>
                    No pending applications
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;

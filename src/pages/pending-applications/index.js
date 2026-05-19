import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Collapse,
  IconButton,
} from '@mui/material';
import CheckCircleIcon      from '@mui/icons-material/CheckCircle';
import CancelIcon           from '@mui/icons-material/Cancel';
import StoreIcon            from '@mui/icons-material/Store';
import LocationOnIcon       from '@mui/icons-material/LocationOn';
import PhoneIcon            from '@mui/icons-material/Phone';
import EmailIcon            from '@mui/icons-material/Email';
import ExpandMoreIcon       from '@mui/icons-material/ExpandMore';
import PersonIcon           from '@mui/icons-material/Person';
import ImageIcon            from '@mui/icons-material/Image';
import CalendarTodayIcon    from '@mui/icons-material/CalendarToday';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
import { analyzeIdImage } from '../../utility/idVerification';

/* ─── helpers ─── */
const InfoChip = ({ icon: Icon, label, value }) =>
  value ? (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
      <Icon sx={{ fontSize: 15, color: '#52b788', mt: '3px', flexShrink: 0 }} />
      <Box>
        <Typography sx={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.2, fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#222', fontWeight: 600, lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  ) : null;

/* ─── main component ─── */
const SellerApplications = () => {
  const [applications, setApplications]   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selected, setSelected]           = useState(null);
  const [dialogOpen, setDialogOpen]       = useState(false);
  const [dialogType, setDialogType]       = useState('');
  const [expandedId, setExpandedId]       = useState(null);
  const [verifications, setVerifications] = useState({});

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await request({
        url:    api.STORE_API + '/search/findByStatus',
        method: API_METHOD.GET,
        params: { status: 'PENDING' },
      });
      const data = response.data?._embedded?.stores ?? response.data ?? [];
      console.log('STORE DATA:', JSON.stringify(data));
      setApplications(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching applications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  useEffect(() => {
    if (!expandedId) return;
    if (verifications[expandedId]) return;
    const store = applications.find(s =>
      (s.storeId ?? s._links?.self?.href?.split('/').pop()) === expandedId
    );
    const imgSrc = store ? getStoreImage(store) : null;
    if (!imgSrc) return;
    setVerifications(prev => ({ ...prev, [expandedId]: { loading: true, result: null } }));
    analyzeIdImage(imgSrc).then(result =>
      setVerifications(prev => ({ ...prev, [expandedId]: { loading: false, result } }))
    );
  }, [expandedId, applications]);

  const handleAction = async () => {
    if (!selected) return;
    const storeId = selected.storeId ?? selected._links?.self?.href?.split('/').pop();
    setActionLoading(storeId);
    try {
      await request({ url: `${api.STORE_API}/${storeId}/${dialogType}`, method: API_METHOD.PATCH });
      setDialogOpen(false);
      setSelected(null);
      setExpandedId(null);
      fetchApplications();
    } catch (e) {
      console.error('Error updating status:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const openDialog = (store, type) => { setSelected(store); setDialogType(type); setDialogOpen(true); };
  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));

  const getStoreImage = (store) => {
    if (!store.image) return null;
    const key = store.image.startsWith('http')
      ? store.image.replace('https://f004.backblazeb2.com/file/alchives-cdn/', '')
      : store.image;
    const backendBase = window.API_BASE_PATH.replace('/api', '');
    return `${backendBase}/image?key=${encodeURIComponent(key)}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .acc-row {
          background: #fff;
          border-radius: 14px !important;
          border: 1.5px solid #e8f5e9;
          box-shadow: 0 2px 12px rgba(27,67,50,0.05) !important;
          margin-bottom: 10px !important;
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }
        .acc-row:hover { box-shadow: 0 6px 24px rgba(27,67,50,0.11) !important; }
        .acc-row.expanded { border-color: #52b788; box-shadow: 0 6px 28px rgba(45,106,79,0.13) !important; }

        .approve-btn {
          background: linear-gradient(135deg, #2d6a4f, #52b788) !important;
          color: #fff !important;
          border-radius: 10px !important;
          text-transform: none !important;
          font-weight: 700 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 13px !important;
          letter-spacing: 0.3px !important;
          box-shadow: 0 4px 12px rgba(45,106,79,0.25) !important;
        }
        .approve-btn:hover { opacity: 0.88 !important; }

        .reject-btn {
          border: 1.5px solid #e63946 !important;
          color: #e63946 !important;
          border-radius: 10px !important;
          text-transform: none !important;
          font-weight: 700 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 13px !important;
        }
        .reject-btn:hover { background: rgba(230,57,70,0.05) !important; }

        .expand-icon { transition: transform 0.25s ease; }
        .expand-icon.open { transform: rotate(180deg); }

        .fade-in { animation: fadeUp 0.35s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .store-img {
          width: 100%; height: 220px; object-fit: cover; display: block;
          border-radius: 12px;
          border: 1px solid #e8f5e9;
        }
        .store-img-placeholder {
          width: 100%; height: 220px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #f6fbf7;
          border-radius: 12px;
          border: 2px dashed #c8e6c9;
          gap: 8px;
        }
      `}</style>

      <Container maxWidth="lg" style={{ paddingTop: 32, paddingBottom: 48, fontFamily: "'DM Sans', sans-serif" }}>

        {/* ─── Header ─── */}
        <Box mb={3}>
          <Typography style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: '#1b4332', letterSpacing: '-0.5px' }}>
            Pending Accounts
          </Typography>
          <Typography style={{ fontSize: 14, color: '#888', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
            Review and manage incoming store applications
          </Typography>
        </Box>

        {/* ─── Stats bar ─── */}
        {!loading && applications.length > 0 && (
          <Box style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '12px 20px', background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', borderRadius: 14 }}>
            <Box style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StoreIcon style={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography style={{ color: '#fff', fontWeight: 700, fontSize: 20, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                {applications.length}
              </Typography>
              <Typography style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                Pending {applications.length === 1 ? 'Application' : 'Applications'}
              </Typography>
            </Box>
          </Box>
        )}

        {/* ─── Column headers ─── */}
        {!loading && applications.length > 0 && (
          <Box style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 120px 44px', gap: 8, padding: '6px 20px', marginBottom: 6 }}>
            {['#', 'Store Name', 'Email', 'Location', 'Status', ''].map((h, i) => (
              <Typography key={i} style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: "'DM Sans', sans-serif" }}>
                {h}
              </Typography>
            ))}
          </Box>
        )}

        {/* ─── Loading ─── */}
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={8} gap={2}>
            <CircularProgress style={{ color: '#2d6a4f' }} />
            <Typography style={{ color: '#aaa', fontSize: 13 }}>Fetching applications…</Typography>
          </Box>

        /* ─── Empty ─── */
        ) : applications.length === 0 ? (
          <Box style={{ padding: '64px 32px', textAlign: 'center', borderRadius: 20, border: '2px dashed #c8e6c9', marginTop: 16 }}>
            <Box style={{ width: 72, height: 72, borderRadius: 20, background: '#f0f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <StoreIcon style={{ fontSize: 36, color: '#ccc' }} />
            </Box>
            <Typography style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: '#888' }}>
              No Pending Accounts
            </Typography>
            <Typography style={{ fontSize: 13, color: '#bbb', marginTop: 6 }}>
              All seller applications will appear here for review.
            </Typography>
          </Box>

        /* ─── Accordion rows ─── */
        ) : (
          <Box>
            {applications.map((store, idx) => {
              const storeId  = store.storeId ?? store._links?.self?.href?.split('/').pop();
              const imgSrc   = getStoreImage(store);
              const address  = [store.firstAddress, store.secondAddress].filter(Boolean).join(', ');
              const location = [address, store.city, store.state].filter(Boolean).join(', ') || '—';
              const isOpen   = expandedId === storeId;

              return (
                <Box
                  key={storeId ?? idx}
                  className={`acc-row fade-in${isOpen ? ' expanded' : ''}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* ── Summary row ── */}
                  <Box
                    onClick={() => toggleExpand(storeId)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 1fr 1fr 120px 44px',
                      gap: 8,
                      padding: '14px 20px',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: isOpen ? '#f6fbf7' : '#fff',
                      transition: 'background 0.2s',
                    }}
                  >
                    {/* Index */}
                    <Typography style={{ fontSize: 13, color: '#bbb', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                      {idx + 1}
                    </Typography>

                    {/* Store name + avatar */}
                    <Box style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <Box style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#e8f5e9', border: '1.5px solid #c8e6c9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {imgSrc
                          ? <img src={imgSrc} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                          : <StoreIcon style={{ fontSize: 18, color: '#74c69d' }} />
                        }
                      </Box>
                      <Typography style={{ fontSize: 14, fontWeight: 700, color: '#1b4332', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {store.name ?? 'Unnamed Store'}
                      </Typography>
                    </Box>

                    {/* Email */}
                    <Typography style={{ fontSize: 13, color: '#555', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {store.email ?? '—'}
                    </Typography>

                    {/* Location */}
                    <Typography style={{ fontSize: 13, color: '#555', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {location}
                    </Typography>

                    {/* Status badge */}
                    <Chip
                      label="● Pending"
                      size="small"
                      style={{ background: '#fff3e0', color: '#f4a261', fontWeight: 700, fontSize: 11, fontFamily: "'DM Sans', sans-serif", border: '1px solid #ffe0b2' }}
                    />

                    {/* Expand icon */}
                    <IconButton size="small" style={{ color: '#52b788' }}>
                      <ExpandMoreIcon className={`expand-icon${isOpen ? ' open' : ''}`} />
                    </IconButton>
                  </Box>

                  {/* ── Expanded detail panel ── */}
                  <Collapse in={isOpen} timeout={280}>
                    <Divider style={{ borderColor: '#e8f5e9' }} />
                    <Box style={{ padding: '24px 28px', background: '#fafffe' }}>
                      <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

                        {/* Left: image + verification */}
                        <Box>
                          <Typography style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
                            <ImageIcon style={{ fontSize: 14 }} /> ID Photo
                          </Typography>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={store.name}
                              className="store-img"
                              onError={(e) => { e.target.parentNode.innerHTML = `<div class="store-img-placeholder"><svg style="width:40px;height:40px;color:#c8e6c9" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg><span style="font-size:13px;color:#aaa;font-family:DM Sans,sans-serif">No image uploaded</span></div>`; }}
                            />
                          ) : (
                            <div className="store-img-placeholder">
                              <ImageIcon style={{ fontSize: 40, color: '#c8e6c9' }} />
                              <Typography style={{ fontSize: 13, color: '#aaa', fontFamily: "'DM Sans', sans-serif" }}>No image uploaded</Typography>
                            </div>
                          )}

                          {/* ── ID Verification Card ── */}
                          {imgSrc && (() => {
                            const v = verifications[storeId];
                            if (!v) return null;
                            if (v.loading) return (
                              <Box style={{ marginTop: 10, padding: '12px 14px', borderRadius: 10, background: '#f6fbf7', border: '1px solid #e8f5e9', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <CircularProgress size={14} style={{ color: '#52b788' }} />
                                <Typography style={{ fontSize: 12, color: '#888', fontFamily: "'DM Sans', sans-serif" }}>Analyzing ID photo…</Typography>
                              </Box>
                            );
                            const { label, color, bg, flags } = v.result;
                            return (
                              <Box style={{ marginTop: 10, borderRadius: 12, border: `1.5px solid ${color}30`, overflow: 'hidden' }}>
                                {/* Header */}
                                <Box style={{ background: bg, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: "'DM Sans', sans-serif" }}>
                                    ID Verification
                                  </Typography>
                                  <Box style={{ background: color, color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                                    {label}
                                  </Box>
                                </Box>
                                {/* Flags */}
                                <Box style={{ background: '#fff', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  {flags.map((f, i) => (
                                    <Box key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                                      <Typography style={{ fontSize: 13, lineHeight: 1, marginTop: 1 }}>
                                        {f.ok ? '✅' : '⚠️'}
                                      </Typography>
                                      <Typography style={{ fontSize: 12, color: f.ok ? '#2d6a4f' : '#b5451b', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                                        {f.text}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            );
                          })()}
                        </Box>

                        {/* Right: details */}
                        <Box style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                          {/* Store details */}
                          <Box>
                            <Typography style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
                              Store Information
                            </Typography>
                            <Box style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8f5e9', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <InfoChip icon={StoreIcon}      label="Store Name"  value={store.name} />
                              <InfoChip icon={EmailIcon}      label="Email"       value={store.email} />
                              <InfoChip icon={PhoneIcon}      label="Phone"       value={store.phoneNumber} />
                              <InfoChip icon={LocationOnIcon} label="Address"     value={[store.firstAddress, store.secondAddress].filter(Boolean).join(', ')} />
                              <InfoChip icon={LocationOnIcon} label="City / State" value={[store.city, store.state].filter(Boolean).join(', ')} />
                              {store.createdAt && <InfoChip icon={CalendarTodayIcon} label="Applied On" value={new Date(store.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })} />}
                            </Box>
                          </Box>

                          {/* Owner / contact (if separate fields exist) */}
                          {(store.ownerName || store.ownerEmail || store.contactPerson) && (
                            <Box>
                              <Typography style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
                                Owner / Contact
                              </Typography>
                              <Box style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8f5e9', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <InfoChip icon={PersonIcon} label="Owner"   value={store.ownerName ?? store.contactPerson} />
                                <InfoChip icon={EmailIcon}  label="Owner Email" value={store.ownerEmail} />
                              </Box>
                            </Box>
                          )}

                          {/* Description */}
                          {store.description && (
                            <Box style={{ background: '#f6fbf7', borderLeft: '3px solid #74c69d', borderRadius: '0 10px 10px 0', padding: '12px 14px' }}>
                              <Typography style={{ fontSize: 10, color: '#74c69d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
                                Notes / Description
                              </Typography>
                              <Typography style={{ fontSize: 13, color: '#444', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                                {store.description}
                              </Typography>
                            </Box>
                          )}

                          {/* Action buttons */}
                          <Box style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 8 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              className="approve-btn"
                              startIcon={actionLoading === storeId ? null : <CheckCircleIcon />}
                              onClick={(e) => { e.stopPropagation(); openDialog(store, 'approve'); }}
                              disabled={!!actionLoading}
                            >
                              {actionLoading === storeId && dialogType === 'approve'
                                ? <CircularProgress size={16} style={{ color: '#fff' }} />
                                : 'Approve'}
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              className="reject-btn"
                              startIcon={<CancelIcon />}
                              onClick={(e) => { e.stopPropagation(); openDialog(store, 'reject'); }}
                              disabled={!!actionLoading}
                            >
                              Reject
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        )}

        {/* ─── Confirm Dialog ─── */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          PaperProps={{
            style: {
              borderRadius: 20,
              padding: 8,
              fontFamily: "'DM Sans', sans-serif",
              maxWidth: 380,
              width: '100%',
              border: dialogType === 'approve' ? '1.5px solid #c8e6c9' : '1.5px solid #ffd6d8',
            }
          }}
        >
          <Box style={{ padding: '8px 8px 0' }}>
            <Box style={{
              width: 52, height: 52, borderRadius: 16, margin: '0 auto 12px',
              background: dialogType === 'approve' ? '#d8f3dc' : '#fff0f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {dialogType === 'approve'
                ? <CheckCircleIcon style={{ color: '#2d6a4f', fontSize: 28 }} />
                : <CancelIcon style={{ color: '#e63946', fontSize: 28 }} />}
            </Box>
            <DialogTitle style={{ textAlign: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, padding: '0 0 8px', color: '#1b1b1b' }}>
              {dialogType === 'approve' ? 'Approve Application?' : 'Reject Application?'}
            </DialogTitle>
            <DialogContent style={{ textAlign: 'center', padding: '0 16px 16px' }}>
              <Typography style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
                You are about to <strong style={{ color: dialogType === 'approve' ? '#2d6a4f' : '#e63946' }}>{dialogType}</strong> the application from{' '}
                <strong style={{ color: '#1b1b1b' }}>{selected?.name}</strong>.{' '}
                {dialogType === 'approve'
                  ? 'Their seller account will be activated.'
                  : 'The applicant will be notified of this decision.'}
              </Typography>
            </DialogContent>
          </Box>
          <DialogActions style={{ padding: '0 16px 16px', gap: 8 }}>
            <Button
              fullWidth
              onClick={() => setDialogOpen(false)}
              style={{ textTransform: 'none', color: '#999', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, border: '1px solid #eee' }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleAction}
              variant="contained"
              style={{
                background: dialogType === 'approve' ? 'linear-gradient(135deg, #2d6a4f, #52b788)' : '#e63946',
                color: '#fff',
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: dialogType === 'approve' ? '0 4px 12px rgba(45,106,79,0.3)' : '0 4px 12px rgba(230,57,70,0.3)',
              }}
            >
              {actionLoading
                ? <CircularProgress size={16} style={{ color: '#fff' }} />
                : `Yes, ${dialogType === 'approve' ? 'Approve' : 'Reject'}`}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default SellerApplications;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import Title from '../../components/title';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
import useStyles from './styles';
import { useHistory } from 'react-router';

const HEADERS = { 'ngrok-skip-browser-warning': 'true' };

const ProductImage = ({ src, name }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <Box sx={{ width: 72, height: 72, borderRadius: 2, background: '#e8f5e9',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <InventoryIcon sx={{ fontSize: 32, color: '#74c69d' }} />
      </Box>
    );
  }
  return (
    <img src={src} alt={name} onError={() => setErr(true)}
      style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
  );
};

const SellerProducts = (props) => {
  const { notify } = props;
  const classes = useStyles();
  const history = useHistory();

  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selected, setSelected]           = useState(null);
  const [deleteOpen, setDeleteOpen]       = useState(false);
  const [keyword, setKeyword]             = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [productsRes, storesRes] = await Promise.all([
        request({
          url:     api.PRODUCT_ITEM_API + '/all',
          method:  API_METHOD.GET,
          headers: HEADERS,
        }),
        request({
          url:     api.STORE_API + '/search/findByStatus',
          method:  API_METHOD.GET,
          params:  { status: 'APPROVED' },
          headers: HEADERS,
        }),
      ]);

      const rawStores = Array.isArray(storesRes.data)
        ? storesRes.data
        : storesRes.data?._embedded?.stores ?? [];

      const storeMap = {};
      rawStores.forEach((s) => {
        if (s.storeId != null) storeMap[String(s.storeId)] = s;
      });

      const rawProducts = Array.isArray(productsRes.data) ? productsRes.data : [];

      console.log('Total products fetched:', rawProducts.length, 'stores:', rawStores.length);

      const enriched = rawProducts.map((item) => {
        const productItemId = String(item.productItemId);

        const store      = storeMap[String(item.storeId)] ?? null;
        const storeName  = store ? store.name : ('Store #' + (item.storeId ?? '?'));
        const storeEmail = store ? store.email : null;

        let imageUrl = item.imageUrl ?? item.image ?? null;
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
          imageUrl = window.API_BASE_PATH + imageUrl;
        }

        return {
          productItemId,
          name:        item.name        || '-',
          description: item.description || '',
          category:    item.categoryName || item.category || '-',
          price:       item.price        || 0,
          stock:       item.stock        || 0,
          published:   item.published    || item.status === 'ACTIVE',
          imageUrl,
          storeName,
          storeEmail,
          storeId:     item.storeId,
        };
      });

      setProducts(enriched);
    } catch (e) {
      console.error('Error fetching seller products:', e);
      if (notify) notify('error', 'Failed to load seller products.');
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts(); }, []);
  const handleDelete = async () => {
    if (!selected) return;
    setActionLoading(selected.productItemId);
    try {
      await request({
        url:     api.PRODUCT_ITEM_API + '/' + selected.productItemId,
        method:  API_METHOD.DELETE,
        headers: HEADERS,
      });

      if (selected.storeEmail) {
        await request({
          url:    api.NOTIFICATIONS_API,
          method: API_METHOD.POST,
          data: {
            email:   selected.storeEmail,
            title:   'Product Removed by Admin',
            message: 'Your product "' + selected.name + '" has been removed by the administrator.',
            type:    'REJECTED',
          },
          headers: HEADERS,
        }).catch(() => {});
      }

      if (notify) notify('success', '"' + selected.name + '" has been removed and the seller has been notified.');
      setDeleteOpen(false);
      setSelected(null);
      fetchProducts();
    } catch (e) {
      console.error('Delete error:', e);
      if (notify) notify('error', 'Failed to remove the product. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = keyword
    ? products.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase()) ||
        p.storeName.toLowerCase().includes(keyword.toLowerCase()) ||
        p.category.toLowerCase().includes(keyword.toLowerCase())
      )
    : products;

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box className={classes.header}>
        <Title>Seller Products</Title>
        <Typography variant="body2" className={classes.subtitle}>
          All products uploaded by sellers. You can edit or remove any product below.
        </Typography>
      </Box>

      <Box className={classes.searchRow}>
        <TextField
          variant="outlined" size="small"
          placeholder="Search by product name, store, or category..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={classes.searchInput}
        />
        <Typography variant="body2" className={classes.countText}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {loading ? (
        <Box className={classes.center}><CircularProgress style={{ color: '#086108' }} /></Box>
      ) : filtered.length === 0 ? (
        <Box className={classes.empty}>
          <InventoryIcon sx={{ fontSize: 56, color: '#ccc', mb: 1 }} />
          <Typography variant="body1" style={{ color: '#999' }}>No seller products found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.productItemId}>
              <Box className={classes.card}>
                <Box className={classes.cardTop}>
                  <ProductImage src={product.imageUrl} name={product.name} />
                  <Box className={classes.cardInfo}>
                    <Typography className={classes.productName}>{product.name}</Typography>
                    <Typography className={classes.productCategory}>{product.category}</Typography>
                    <Typography className={classes.productPrice}>P{Number(product.price).toFixed(2)}</Typography>
                    <Typography className={classes.productStock}>Stock: <strong>{product.stock}</strong></Typography>
                  </Box>
                </Box>

                <Box className={classes.storeRow}>
                  <StorefrontIcon sx={{ fontSize: 14, color: '#74c69d', mr: 0.5 }} />
                  <Typography className={classes.storeName}>{product.storeName}</Typography>
                  <Box className={classes.statusBadge} style={{
                    background: product.published ? '#d8f3dc' : '#f5f5f5',
                    color:      product.published ? '#086108' : '#888',
                  }}>
                    {product.published ? 'Published' : 'Draft'}
                  </Box>
                </Box>

                <Box className={classes.actions}>
                  <Button size="small" variant="outlined" startIcon={<EditIcon />}
                    className={classes.editBtn}
                    onClick={() => history.push('/BuyAni/seller-products/update/' + product.productItemId)}>
                    Edit
                  </Button>
                  <Button size="small" variant="outlined" startIcon={<DeleteIcon />}
                    className={classes.deleteBtn}
                    onClick={() => { setSelected(product); setDeleteOpen(true); }}>
                    Remove
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ color: '#e63946', fontWeight: 700 }}>Remove Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>"{selected && selected.name}"</strong> from{' '}
            <strong>{selected && selected.storeName}</strong>?
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, color: '#666' }}>
            The seller will be notified about this removal.
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: '12px 24px' }}>
          <Button onClick={() => setDeleteOpen(false)} style={{ color: '#555' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained"
            disabled={actionLoading === (selected && selected.productItemId)}
            style={{ background: '#e63946', color: '#fff' }}>
            {actionLoading === (selected && selected.productItemId)
              ? <CircularProgress size={18} style={{ color: '#fff' }} />
              : 'Remove & Notify Seller'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerProducts;
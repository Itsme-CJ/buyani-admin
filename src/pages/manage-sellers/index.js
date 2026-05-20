import { Box, Container, Grid } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Modal from '../../components/modal';
import SearchBar from '../../components/search-bar';
import EnhancedTable from '../../components/table';
import Title from '../../components/title';
import api from '../../service/api';
import { request, multipleRequest } from '../../service/request';
import { createHeadCells, handleAuditLog } from '../../utility';
import { API_METHOD } from '../../utility/constant';
import { AuthContext } from '../../context/AuthContext';
import useStyles from './styles';

export const headCells = [
  createHeadCells('sellerId',   false, 'Seller ID',   true,  true),
  createHeadCells('name',       false, 'Name',        false, true),
  createHeadCells('email',      false, 'Email',       false, true),
  createHeadCells('status',     false, 'Status',      false, false),
  createHeadCells('action',     false, 'Action',      false, false),
];

// Utility: shape a raw seller/store object into table row data
const createSellerData = (sellerId, name, email, status) => ({
  id: sellerId,
  sellerId,
  name,
  email,
  status,
});

const ManageSellers = (props) => {
  const { notify } = props;
  const classes = useStyles();
  const history = useHistory();
  const { state } = useContext(AuthContext);

  const [data, setData]               = useState([]);
  const [total, setTotal]             = useState(0);
  const [order, setOrder]             = useState('asc');
  const [orderBy, setOrderBy]         = useState(headCells[0].id);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage]               = useState(0);
  const [isLoading, setIsLoading]     = useState(false);
  const [keyword, setKeyword]         = useState('');

  const [deleteOpen, setDeleteOpen]   = useState(false);
  const [deleteList, setDeleteList]   = useState([]);
  const [deleteIdList, setDeleteIdList] = useState([]);

  // ── Pagination / sort handlers ────────────────────────────────────────────
  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // ── Data fetching ─────────────────────────────────────────────────────────
  /**
   * Adjust the API endpoint below to match your backend.
   * Common patterns in your codebase: api.STORES_API or a dedicated sellers endpoint.
   * The formatter below handles both a `_embedded.stores` and `_embedded.sellers` key.
   */
  const SELLERS_API = api.STORE_API + '/search/findByStatus';

  const formatData = (sellers = []) =>
    sellers.map((item) => {
      const { firstName, lastName, storeName, email, status, _links } = item;
      const sellerId = _links?.self?.href?.split('/').pop() ?? item.storeId ?? item.id;
      // Support both individual seller accounts and store entities
      const name = storeName ?? (firstName && lastName ? `${lastName}, ${firstName}` : '—');
      return createSellerData(sellerId, name, email ?? '—', status ?? 'Active');
    });

  const getData = async () => {
    setIsLoading(true);
    const params = {
      status: 'APPROVED',
      size: rowsPerPage,
      page,
      sort: `${orderBy},${order}`,
      ...(keyword ? { name: keyword } : {}),
    };

    try {
      const response = await request({
        url: SELLERS_API,
        method: API_METHOD.GET,
        params,
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });

      if (response.data?._embedded) {
        const { _embedded, page: pageInfo } = response.data;
        // Try both key names depending on your API shape
        const sellers =
          _embedded.stores ??
          _embedded.sellers ??
          _embedded.appUsers ??
          [];
        const formatted = formatData(sellers);
        setData(formatted);
        setTotal(pageInfo?.totalElements ?? formatted.length);
        setPage(pageInfo?.number ?? 0);
        setRowsPerPage(pageInfo?.size ?? rowsPerPage);
      } else if (Array.isArray(response.data)) {
        const formatted = formatData(response.data);
        setData(formatted);
        setTotal(formatted.length);
      }
    } catch (e) {
      console.error('ManageSellers fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    return () => setData([]);
  }, [page, rowsPerPage, order, orderBy, keyword]);

  // ── Delete handlers ───────────────────────────────────────────────────────
  const handleOpenDeleteModal = (values) => {
    setDeleteOpen(true);
    setDeleteIdList([values.id]);
    setDeleteList([values.name]);
  };

  const handleCloseDeleteModal = () => setDeleteOpen(false);

  const handleDelete = async () => {
    try {
      await multipleRequest(
        deleteIdList.map((id) =>
          request({ url: `${api.STORE_API}/${parseInt(id)}`, method: API_METHOD.DELETE })
        )
      );
      await handleAuditLog(
        state, deleteIdList[0], state.user.storeId,
        'seller', 'deleted', { name: deleteList[0] }, null
      );
      notify('success', `Seller "${deleteList[0]}" deleted successfully!`);
      getData();
    } catch (err) {
      console.error(err);
      notify('error', `Failed to delete seller "${deleteList[0]}".`);
    }
    handleCloseDeleteModal();
  };

  // ── Edit handler ──────────────────────────────────────────────────────────
  const onUpdate = (value) => {
    history.push(`/BuyAni/manage-sellers/update/${value.id}`);
  };

  return (
    <Container className={classes.container}>
      <Title name="Manage Sellers" />

      <Grid container style={{ marginBottom: '16px' }}>
        <Grid item xl={6} lg={6} md={6} xs={12} sm={6}>
          <SearchBar handleSearchQuery={setKeyword} />
        </Grid>
      </Grid>

      <Modal
        open={deleteOpen}
        handleClose={handleCloseDeleteModal}
        handleSubmit={handleDelete}
        buttonName="Delete"
        image=""
        title="Delete Seller"
      >
        <Box className={classes.deleteContent}>
          Are you sure you want to delete <strong>{deleteList.join(', ')}</strong>?
        </Box>
      </Modal>

      <EnhancedTable
        isLoading={isLoading}
        rows={data}
        headCells={headCells}
        handleRequestSort={handleRequestSort}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        order={order}
        orderBy={orderBy}
        page={page}
        rowsPerPage={rowsPerPage}
        name="Manage Sellers"
        handleDelete={handleOpenDeleteModal}
        totalItems={total}
        onUpdate={onUpdate}
      />
    </Container>
  );
};

export default ManageSellers;

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
  createHeadCells('user_id', false, 'User ID', true, true),
  createHeadCells('name',   false, 'Name',    false, true),
  createHeadCells('email',  false, 'Email',   false, true),
  createHeadCells('status', false, 'Status',  false, false),
  createHeadCells('action', false, 'Action',  false, false),
];

// Utility: shape a raw user object into table row data
const createAppUserData = (userId, name, email, status) => ({
  id: userId,
  userId,
  name,
  email,
  status,
});

const ManageUsers = (props) => {
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
  const formatData = (users = []) =>
    users.map((item) => {
      const { userId, firstName, lastName, email, status } = item;
      const name = `${lastName ?? ''}, ${firstName ?? ''}`.trim().replace(/^,\s*/, '') || '—';
      return createAppUserData(userId ?? item.id, name, email ?? '—', status ?? 'Active');
    });

  const getData = async () => {
    setIsLoading(true);
    const params = {
      size: rowsPerPage,
      page,
      ...(keyword ? { firstName: keyword, lastName: keyword } : {}),
    };

    try {
      const response = await request({
        url: `${api.USER_API}/customers`,
        method: API_METHOD.GET,
        params,
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });

      const data = response.data;
      if (data?.content) {
        const formatted = formatData(data.content);
        setData(formatted);
        setTotal(data.totalElements ?? formatted.length);
        setPage(data.number ?? 0);
        setRowsPerPage(data.size ?? rowsPerPage);
      } else if (Array.isArray(data)) {
        const formatted = formatData(data);
        setData(formatted);
        setTotal(formatted.length);
      }
    } catch (e) {
      console.error('ManageUsers fetch error:', e);
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
          request({ url: `${api.USERS_API}/${parseInt(id)}`, method: API_METHOD.DELETE })
        )
      );
      await handleAuditLog(
        state, deleteIdList[0], state.user.storeId,
        'app-user', 'deleted', { name: deleteList[0] }, null
      );
      notify('success', `User "${deleteList[0]}" deleted successfully!`);
      getData();
    } catch (err) {
      console.error(err);
      notify('error', `Failed to delete user "${deleteList[0]}".`);
    }
    handleCloseDeleteModal();
  };

  // ── Edit handler ──────────────────────────────────────────────────────────
  const onUpdate = (value) => {
    history.push(`/BuyAni/manage-users/update/${value.id}`);
  };

  return (
    <Container className={classes.container}>
      <Title name="Manage Users" />

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
        title="Delete User"
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
        name="Manage Users"
        handleDelete={handleOpenDeleteModal}
        totalItems={total}
        onUpdate={onUpdate}
      />
    </Container>
  );
};

export default ManageUsers;

import { Box, Container, Grid } from '@material-ui/core';
import { AddBox } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import IconButton from '../../components/icon-button';
import Modal from '../../components/modal';
import SearchBar from '../../components/search-bar';
import EnhancedTable from '../../components/table';
import Title from '../../components/title';
import api from '../../service/api';
import { multipleRequest, request } from '../../service/request';
import { createHeadCells, createSysAdData, handleAuditLog } from '../../utility';
import { API_METHOD } from '../../utility/constant';
import useStyles from './styles';
import { AuthContext } from '../../context/AuthContext';

export const headCells = [
  createHeadCells('user_id', false, 'Admin Id', true, true),
  createHeadCells('last_name', false, 'Name', false, true),
  createHeadCells('email', false, 'Email Address', false, false),
  createHeadCells('action', false, 'Action', false, false),
]

const SystemAdmins = (props) => {
  const { notify } = props;

  const classes = useStyles();
  
  const history = useHistory();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [deleteIdList, setDeleteIdList] = useState([]);
  const { state } = useContext(AuthContext);

  const getProps = {
    api: api.USERS_API + '/search/findByRoleName' ,
    keyword: '',
    dataFormat: createSysAdData,
    pageName: 'User',
    params: {
      name: 'ADMIN'
    }
  }
  const [data, setData]               = useState([]);
  const [total, setTotal]   = useState(0);
  const [order, setOrder]             = useState('asc');
  const [orderBy, setOrderBy]         = useState(headCells ? headCells[0].id: 'asc');
  const [rowsPerPage, setRowsPerPage] = useState(getProps.params.size ? getProps.params.size : 10);
  const [page, setPage]               = useState(0);
  const [isLoading, setIsLoading]     = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const formatData = async (embedded) => {
    const productCategoryData = await Promise.all(embedded.users.map(async (item) => {
      const { firstName, lastName, email, _links } = item;
      const name = lastName + ', ' + firstName;
      const userId = _links.self.href.replace(`${api.USERS_API}/`, '');

      return getProps.dataFormat(userId, name, email);
    }));

    return productCategoryData
  }

  const getData = async () => {
    setIsLoading(true);

    let params = {
      ...getProps.params,
      firstName: keyword,
      lastName: keyword,
      size: rowsPerPage,
      page: page,
      sort: `${orderBy},${order}`
    }

    if (!keyword) {
      params = {
        ...getProps.params,
        size: rowsPerPage,
        page: page,
        sort: `${orderBy},${order}`
      }
    }

    try {
      const response = await request({
        url     :  keyword ? api.USERS_API + '/search/system-admin-search': getProps.api,
        method  : API_METHOD.GET,
        params  : params,
        headers: {
         'ngrok-skip-browser-warning': 'true'
        }
      })

      if (response.data?.page) {
        const { number, size, totalElements } = response.data?.page;

        const { _embedded } = response.data;
        const formattedData = await formatData(_embedded);

        if (formattedData.length || number === 0) {
          setPage(number);
        } else {
          setPage(number - 1);
        }
        setData(formattedData);
        setRowsPerPage(size);
        setTotal(totalElements);
      } else {
        setData(response.data)
      }

      console.log('response', response)
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateData = async(ids) => {
    const newItems = data.filter(prev => {
      return !ids.includes(prev.id)
    });
    await getData();
  }

  useEffect(() => {
    getData();

    return () => {
      setData([])
    }
  }, [page, rowsPerPage, order, orderBy, keyword]);

  const handleAddUser = () => {
    history.push('/BayAni/system-admins/create');
  }

  const onUpdate = (value) => {
    history.push(`/BayAni/system-admins/update/${value.id}`);
  }

  const handleDelete = async () => {
    try {
      await multipleRequest(deleteIdList.map(async(value) =>
        await request({
          url: `${api.USERS_API}/${parseInt(value)}`,
          method: API_METHOD.DELETE
        })
      )) 

      await handleAuditLog(state, deleteIdList[0], null, 'developer', 'deleted', { name: deleteList[0] } , null)

      notify('success', `The system admin with id ${deleteIdList[0]} has been deleted successfully!`);
    } catch(er) {
      console.log('error?.response?.status', er?.response)
      notify('error', `Failed to delete user id ${deleteIdList[0]}!`);
    }

    handleCloseDeleteModal();
    handleUpdateData(deleteIdList);
  }

  const handleOpenDeleteModal = (values) => {
    setDeleteOpen(true);
    setDeleteIdList([values.id]);
    setDeleteList([values.name])
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
  }

  const handleSearchQuery = (values) => {
    setKeyword(values);
  }

  return (
    <Container className={classes.container}>
      <Title name='Developers'/>
      <Grid container style={{ marginBottom: '16px' }}>
        <Grid item xl={6} lg={6} md={6} xs={10} sm={6}>
          <SearchBar handleSearchQuery={handleSearchQuery}/>
        </Grid>
        <Grid className={classes.iconContainer} item xl={6} lg={6} md={6} xs={2} sm={6}>
          <IconButton title='Add System Admin' icon={<AddBox fontSize='large' />} handleClick={handleAddUser} />
        </Grid>
      </Grid>
      <Modal 
        open={deleteOpen} 
        handleClose={handleCloseDeleteModal} 
        handleSubmit={handleDelete} 
        buttonName='Delete'
        image={''}
        title='Delete System Admin'
      >
        <Box className={classes.deleteContent}>
          Are you sure you want to delete { deleteList.join(', ')}?
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
        name='Users'
        handleDelete={handleOpenDeleteModal}
        totalItems={total}
        onUpdate={onUpdate}
      />
    </Container>
  )
}

export default SystemAdmins
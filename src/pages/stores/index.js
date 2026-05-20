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
import { createHeadCells, createStoreData, createSysAdData, handleAuditLog } from '../../utility';
import { API_METHOD } from '../../utility/constant';
import useStyles from './styles';
import { AuthContext } from '../../context/AuthContext';

export const headCells = [
  createHeadCells('storeId', false, 'Store Id', true, true),
  createHeadCells('name', false, 'Store Name', false, true),
  createHeadCells('address', false, 'Address', false, false),
  createHeadCells('storeStatus', false, 'Status', false, false),
  createHeadCells('action', false, 'Action', false, false),
]

const Stores = (props) => {
  const { notify } = props;

  const classes = useStyles();
  
  const history = useHistory();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [deleteIdList, setDeleteIdList] = useState([]);

  const getProps = {
    api: api.STORE_API ,
    keyword: '',
    dataFormat: createStoreData,
    pageName: 'User',
  }
  const [data, setData]               = useState([]);
  const [total, setTotal]   = useState(0);
  const [order, setOrder]             = useState('asc');
  const [orderBy, setOrderBy]         = useState(headCells ? headCells[0].id: 'asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage]               = useState(0);
  const [isLoading, setIsLoading]     = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [storeId, setStoreId] = useState(null);

  const { state } = useContext(AuthContext);

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
    const productCategoryData = await Promise.all(embedded.stores.map(async (item) => {
      const { name, email, _links, city, firstAddress, secondAddress, status } = item;
      const storeId = _links.self.href.replace(`${api.STORE_API}/`, '');
      const addrs = firstAddress ? firstAddress + ', ' + secondAddress + city : secondAddress + city;

      return getProps.dataFormat(storeId, name, addrs, status);
    }));

    return productCategoryData
  }

  const getData = async () => {
    setIsLoading(true);

    let params = {
      name: keyword,
      size: rowsPerPage,
      page: page,
      sort: `${orderBy},${order}`
    }

    if (!keyword) {
      params = {
        size: rowsPerPage,
        page: page,
        sort: `${orderBy},${order}`
      }
    }

    try {
      const response = await request({
        url     : getProps.api,
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
    history.push('/BuyAni/stores/create');
  }

  const onUpdate = (value) => {
    history.push(`/BuyAni/stores/update/${value.id}`);
  }

  const handleDelete = async () => {
    try {
      await multipleRequest(deleteIdList.map(async(value) =>
        await request({
          url: `${api.STORE_API}/${parseInt(value)}`,
          method: API_METHOD.DELETE
        })
      )) 

      await handleAuditLog(state, deleteIdList[0], null, 'store', 'deleted', { name: deleteList[0] } , null)
      notify('success', `The store with id ${deleteIdList[0]} has been deleted successfully!`);
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

  const handleStatusChange = ({ id, name, status }) => {
    setStatusOpen(true);
    setStoreId({ id, name, status })
  }

  const handleCloseStatusModal = () => {
    setStatusOpen(false);
  }

  const handleStatus = async () => {
    try {
      await request({
        url: `${api.STORE_API}/${storeId.id}`,
        method: API_METHOD.PATCH,
        data: {
          status: storeId.status ? 0 : 1,
          isReservationActivated: storeId.status ? 0 : 1
        },
      })
      await handleAuditLog(state, storeId.id, null, 'store', 'updated', { name: storeId.name, status:  storeId.status ? 'Activated': 'Deactivated'} , 
        { name: storeId.name, status:  storeId.status ? 'Deactivated' : 'Activated' })

      await getData();
      setStatusOpen(false);
      notify('success', `The ${storeId.name} has been updated successfully!`);
    } catch {
      notify('error', `Failed to update the store ${storeId.name}`);
      setStatusOpen(false);
    }
  }

  return (
    <Container className={classes.container}>
      <Title name='Stores'/>
      <Grid container style={{ marginBottom: '16px' }}>
        <Grid item xl={6} lg={6} md={6} xs={10} sm={6}>
          <SearchBar handleSearchQuery={handleSearchQuery}/>
        </Grid>
        <Grid className={classes.iconContainer} item xl={6} lg={6} md={6} xs={2} sm={6}>
          <IconButton title='Add Store' icon={<AddBox fontSize='large' />} handleClick={handleAddUser} />
        </Grid>
      </Grid>
      <Modal 
        open={deleteOpen} 
        handleClose={handleCloseDeleteModal} 
        handleSubmit={handleDelete} 
        buttonName='Delete'
        image={''}
        title='Delete Stores'
      >
        <Box className={classes.deleteContent}>
          Are you sure you want to delete { deleteList.join(', ')}?
          Deleting the store will remove all data and prevent the BuyAni admins from accessing the system.
        </Box>
      </Modal>
      <Modal 
        open={statusOpen} 
        handleClose={handleCloseStatusModal} 
        handleSubmit={handleStatus} 
        buttonName='Yes'
        image={''}
        title={storeId?.status ? 'Deactivate Store' : 'Activate Store'}
      >
        <Box className={classes.deleteContent}>
          {
            storeId?.status ?
              "Are you sure you want to deactivate this store? Deactivating the store will prevent any store admin from logging into the system and will also disable the store's reservation feature."
            :
              "Are you sure you want to activate this store? Activating the store will allow store admins to log into the system and will also enable the store's reservation feature."
          }
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
        name='Stores'
        handleDelete={handleOpenDeleteModal}
        totalItems={total}
        onUpdate={onUpdate}
        handleStatusChange={handleStatusChange}
      />
    </Container>
  )
}

export default Stores
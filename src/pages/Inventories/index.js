import { Box, Container, Grid, Tab, Tabs } from '@material-ui/core';
import { AddBox, FilterList } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import IconButton from '../../components/icon-button';
import Loading from '../../components/loading';
import Modal from '../../components/modal';
import SearchBar from '../../components/search-bar';
import EnhancedTable from '../../components/table';
import Title from '../../components/title';
import useGetApi from '../../hooks/useGetApi';
import useResponsive from '../../hooks/useResponsive';
import api from '../../service/api';
import { multipleRequest, request } from '../../service/request';
import { createAlumniData, createHeadCells, createProductCategoryData, createProductItemData, createProgramData, getBatchYear, handleAuditLog } from '../../utility';
import { API_METHOD } from '../../utility/constant';
import useStyles from './styles';
import { AuthContext } from '../../context/AuthContext';
import Select from '../../components/select';

export const headCells = [
  createHeadCells('productItemId', false, 'Product Id', false, true),
  createHeadCells('productNumber', false, 'Product Number', false, true),
  createHeadCells('name', false, 'Brand Name', false, true),
  createHeadCells('genericName', false, 'Generic Name', false, true),
  createHeadCells('category', false, 'Category', false, false),
  createHeadCells('price', false, 'Price', false, true),
  createHeadCells('stocks', false, 'Stocks (pcs)', false, true),
  createHeadCells('action', false, 'Action', false, false),
]

export const categoryHeadCells = [
  createHeadCells('productCategoryId', false, 'Category ID', false, true),
  createHeadCells('name', false, 'Category Name', false, true),
  createHeadCells('itemNumber', false, '# of Items', false, true),
  createHeadCells('action', false, 'Action', false, false),
]

const Product = (props) => {
  const { notify } = props;

  const classes = useStyles();
  
  const history = useHistory();
  const { state } = useContext(AuthContext);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [deleteIdList, setDeleteIdList] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const getProps = {
    api: api.PRODUCT_CATEGORIES_BY_STORE_ID_API,
    keyword: '',
    dataFormat: createProductItemData,
    columns: headCells,
    pageName: 'ProductItem',
    params: {
      storeId: parseInt(state.user.storeId)
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
  const [categories, setCategories]  = useState([]);
  const [category, setCategory]  = useState('');

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
    const productCategoryData = await Promise.all(embedded.productItems.map(async (item) => {
      const { name, genericName, price, _links, productNumber = 0, stock = 0, criticalLevel } = item;
      const productItemId = _links.self.href.replace(`${api.PRODUCT_ITEMS_API}/`, '');

      const categoryResponse = await request({
        url: _links.productCategory.href,
        method: API_METHOD.GET,
      })
      const { name: categoryName } = categoryResponse.data;
      // let nstock = stock ? stock : 'Out of stock';
      let nstock = stock
      if (stock <= criticalLevel && stock > 0) {
        nstock = `${stock} (Out of stock)`;
      } else if (stock === 0) {
        nstock = 'Out of stock';
      }

      console.log(name, 'stock', stock, 'criticalLevel', criticalLevel, 'nstock', nstock)

      return getProps.dataFormat(productItemId, productNumber, name, genericName, categoryName, `₱${price}`, nstock);
    }));

    return productCategoryData
  }


  const getUrl = (value) => {
    let url = api.PRODUCT_ITEMS_API + '/search/findByStoreId';
    if (value) {
      url = api.PRODUCT_ITEMS_API + '/search/category'
    }

    if (keyword) {
      url = api.PRODUCT_ITEMS_API + '/search/search-products';
      if (value) {
        url = api.PRODUCT_ITEMS_API + '/search/search-products-category'
      }
    }

    return url
  }

  const getData = async (value) => {
    setIsLoading(true);

    let params = {
      ...getProps.params,
      name: keyword,
      category: value,
      productNumber: keyword,
      genericName: keyword,
      size: rowsPerPage,
      page: page,
      sort: `${orderBy},${order}`
    }

    if (!keyword) {
      params = {
        ...getProps.params,
        category: value,
        size: rowsPerPage,
        page: page,
        sort: `${orderBy},${order}`
      }
    }

    try {
      const response = await request({
        url     :  getUrl(value),
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


  const handleAdd = () => {
    history.push('/BuyAni/inventories/create-product');
  }

  const onUpdate = (value) => {
    history.push(`/BuyAni/inventories/update-product/${value.id}`);
  }

  const handleView = (id) => {
    history.push(`/portal/item/${id}`)
  }

  const handleDelete = async () => {
    try {
      await multipleRequest(deleteIdList.map(async(value) =>
        await request({
          url: `${api.PRODUCT_ITEMS_API}/${parseInt(value)}`,
          method: API_METHOD.DELETE
        })
      )) 
      await handleAuditLog(state, deleteIdList[0], state.user.storeId, 'products', 'deleted', { name: deleteList[0] } , null)

      notify('success', `The product item ${deleteList[0]} has been deleted successfully!`);
    } catch(er) {
      notify('error', `Failed to delete product item ${deleteList[0]}!`);
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

  const handleFilter = () => {
    setFilterOpen(true);
  }
  
  const getCategoryProps = {
    api: api.PRODUCT_CATEGORIES_BY_STORE_ID_API,
    keyword: '',
    dataFormat: createProductCategoryData,
    columns: categoryHeadCells,
    pageName: 'ProductCategory',
    params: {
      storeId: state.user.storeId
    }
  }

  const getCategoryData = async () => {
    let params = {
      ...getCategoryProps.params,
      size: 1000,
    }
    try {
      const response = await request({
        url     :  getCategoryProps.api,
        method  : API_METHOD.GET,
        params  : params,
        headers: {
         'ngrok-skip-browser-warning': 'true'
        }
      })
      const { _embedded } = response.data;
      const formattedData = await formatCategoryData(_embedded);
      setCategories(formattedData)
    } catch (e) {
      console.log('Error:', e);
    } finally {
    }
  }

  const formatCategoryData = async(embedded) => {
    const productCategoryData = await Promise.all(embedded.productCategories.map(async (alumni) => {
      const { name, _links } = alumni;
      const productCategoryId = _links.self.href.replace(`${api.PRODUCT_CATEGORIES_API}/`, '');

      return {
        id: productCategoryId,
        name: name
      }
    }));

    return productCategoryData
  }

  const handleClickItem = (item) => {
  }

  useEffect(() => {
    getCategoryData();
  }, [])


  const handleClearFilter = () => {
    setCategory('');

  }

  const handleClick = (value) => {
    let newCategory = value;
    if (category === value) {
      setCategory('');
      newCategory = ''
    } else {
      setCategory(value);
    }
    getData(newCategory);
  }

  return (
    <>
      <Modal 
        open={deleteOpen} 
        handleClose={handleCloseDeleteModal} 
        handleSubmit={handleDelete} 
        buttonName='Delete'
        image={''}
        title='Delete Inventory'
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
        name='ProductCategory'
        handleView={handleView}
        handleDelete={handleOpenDeleteModal}
        totalItems={total}
        onUpdate={onUpdate}
        header={
          <Grid container style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
            <Grid item xl={6} lg={6} md={6} xs={12} sm={12}>
              <SearchBar handleSearchQuery={handleSearchQuery}/>
            </Grid>
            <Grid className={classes.iconContainerProduct} item xl={6} lg={6} md={6} xs={12} sm={12}>
              <Select menuItem={categories} label='Filter by category' isFilter value={category} handleChange={handleClickItem} handleClick={handleClick}/>
              {/* <IconButton title='Filter' icon={<FilterList fontSize='large' />} handleClick={handleFilter} /> */}
              {
                state.user.role.name === 'PADMIN' ? <IconButton style={{width: '250px'}} title='Add Product' icon={<AddBox fontSize='large' />} handleClick={handleAdd} /> : <></>
              }
                
            </Grid>
          </Grid>
        }
      />
    </>
  )
}

const Categories = (props) => {
  const { notify } = props;

  const classes = useStyles();
  
  const history = useHistory();
  const { state } = useContext(AuthContext);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [deleteIdList, setDeleteIdList] = useState([]);

  const getProps = {
    api: api.PRODUCT_CATEGORIES_BY_STORE_ID_API,
    keyword: '',
    dataFormat: createProductCategoryData,
    columns: categoryHeadCells,
    pageName: 'ProductCategory',
    params: {
      storeId: parseInt(state.user.storeId)
    }
  }
  const [data, setData]               = useState([]);
  const [total, setTotal]   = useState(0);
  const [order, setOrder]             = useState('asc');
  const [orderBy, setOrderBy]         = useState(categoryHeadCells ? categoryHeadCells[0].id: 'asc');
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
    const productCategoryData = await Promise.all(embedded.productCategories.map((item) => {
      const { name, itemNumber, _links } = item;
      const productCategoryId = _links.self.href.replace(`${api.PRODUCT_CATEGORIES_API}/`, '');

      return getProps.dataFormat(productCategoryId, name, itemNumber);
    }));

    return productCategoryData
  }

  const getData = async () => {
    setIsLoading(true);

    let params = {
      ...getProps.params,
      name: keyword,
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
        url     :  keyword ? api.PRODUCT_CATEGORIES_API + '/search/findByNameContainingAndStoreStoreId': getProps.api,
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

  const handleAddCategory = () => {
    history.push('/BuyAni/inventories/create-category');
  }

  const onUpdate = (value) => {
    history.push(`/BuyAni/inventories/update-category/${value.id}`);
  }

  const handleView = (id) => {
    history.push(`/portal/item/${id}`)
  }

  const handleDelete = async () => {
    try {
      await multipleRequest(deleteIdList.map(async(value) =>
        await request({
          url: `${api.PRODUCT_CATEGORY_API}/${parseInt(value)}`,
          method: API_METHOD.DELETE
        })
      )) 
      await handleAuditLog(state, deleteIdList[0], state.user.storeId, 'category', 'deleted', { name: deleteList[0] } , null)

      notify('success', `The product category id ${deleteIdList[0]} has been deleted successfully!`);
    } catch(er) {
      console.log('error?.response?.status', er?.response)
      if (er?.response?.status === 400) {
        notify('error', `Product category ${deleteIdList[0]} is currently associated with product items. Cannot be deleted!`);
      } else {
        notify('error', `Failed to delete product category id ${deleteIdList[0]}!`);
      }
    }

    handleCloseDeleteModal();
    handleUpdateData(deleteIdList);
  }

  const handleOpenDeleteModal = (values) => {
    setDeleteOpen(true);
    setDeleteIdList([values.id]);
    setDeleteList([values.categoryName])
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
  }

  const handleSearchQuery = (values) => {
    setKeyword(values);
  }

  return (
    <>
      <Modal 
        open={deleteOpen} 
        handleClose={handleCloseDeleteModal} 
        handleSubmit={handleDelete} 
        buttonName='Delete'
        image={''}
        title='Delete Inventory'
      >
        <Box className={classes.deleteContent}>
          Are you sure you want to delete { deleteList.join(', ')}?
        </Box>
      </Modal>
      <EnhancedTable
        isLoading={isLoading}
        rows={data}
        headCells={categoryHeadCells}
        handleRequestSort={handleRequestSort}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        order={order}
        orderBy={orderBy}
        page={page}
        rowsPerPage={rowsPerPage}
        name='ProductCategory'
        handleView={handleView}
        handleDelete={handleOpenDeleteModal}
        totalItems={total}
        onUpdate={onUpdate}
        header={
          <Grid container style={{ marginBottom: '16px' }}>
            <Grid item xl={6} lg={6} md={6} xs={10} sm={6}>
              <SearchBar handleSearchQuery={handleSearchQuery}/>
            </Grid>
            {
              state.user.role.name === 'PADMIN' ?
                <Grid className={classes.iconContainer} item xl={6} lg={6} md={6} xs={2} sm={6}>
                  <IconButton title='Add Category' icon={<AddBox fontSize='large' />} handleClick={handleAddCategory} />
                </Grid>
              :
              <></>
            }
          </Grid>
        }
      />
    </>
  )
}

const Inventories = (props) => {
  const {notify} = props;
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container className={classes.container}>
      <Title name='Inventories'/>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        className={classes.tabs}
      >
        <Tab label="Products" />
        <Tab label="Categories" />
      </Tabs>
      {
        value === 0? 
          <Product notify={notify}/>
        :
          <Categories notify={notify}/>
      }
    </Container>
  )
}

export default Inventories
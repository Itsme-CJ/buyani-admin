import { Box, Button, Container, Grid, IconButton as IconCloseButton, InputAdornment, Link, List, ListItem, ListItemText, OutlinedInput, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, withStyles } from '@material-ui/core';
import { Block, LocalOffer, Save } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { ListItemButton, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import cancelIcon from '../../assets/images/cancel.svg';
import discountIcon from '../../assets/images/discount.svg';
import logo from '../../assets/images/logo.png';
import Empty from '../../components/empty';
import IconButton from '../../components/icon-button';
import Modal from '../../components/modal';
import ModalSummary from '../../components/modal-summary';
import SearchBar from '../../components/search-bar';
import Select from '../../components/select';
import { AuthContext } from '../../context/AuthContext';
import api from '../../service/api';
import { request } from '../../service/request';
import colors from '../../themes/colors';
import { createHeadCells, createProductCategoryData, createProductItem, handleInputChange, handlePreventNegative } from '../../utility';
import { API_METHOD } from '../../utility/constant';
import { categoryHeadCells } from '../Inventories';
import useStyles from './styles';
import { REQUIRED_FIELD } from '../../validation/schema';
import emptyLogo from '../../assets/images/no-data.svg'


export const headCells = [
  createHeadCells('transactionId', false, 'Transaction Id', true, true),
  createHeadCells('items', false, '# of Items', false, false),
  createHeadCells('ts', false, 'Date', false, true),
  createHeadCells('totalPrice', false, 'TotalPrice', false, false),
  createHeadCells('status', false, 'Status', false, false),
  createHeadCells('action', false, 'Action', false, false),
]

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: colors.PRIMARY,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const TrasactionContent = (props) => {
  const { row, handleClick: handleSubmitItem } = props;
  const [isClick, setIsClick] = useState(false);
  const [value, setValue] = useState(row.quantity)
  const classes = useStyles();
  const inputRef = useRef(null);

  const handleClick = () => {
    setIsClick(true)
  }

  const handleHideTextFiled = () => {
    setIsClick(false);
    
    handleSubmitItem(row, value);
  }

  useEffect(() => {
    setValue(row.quantity);
  }, [row.quantity])
  
  const onChange = (value) => {
    if (parseInt(value.target.value)>  row.stock && !row.tempQuantity) {
      return;
    }

    if (parseInt(value.target.value) - row.quantity >  row.stock && row.tempQuantity) return

    if (parseInt(value.target.value) < 0) return

    setValue(value.target.value);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const ref = inputRef;
      if (ref.current && !ref.current?.contains(event.target)) {
        if (event.target?.id === 'quantity') {
          return;
        }
        handleHideTextFiled();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, handleHideTextFiled]);

  const handleRemove = () => {
    handleSubmitItem(row, 0);
  }

  return (
    <StyledTableRow
      key={row.productNumber}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <StyledTableCell style={{ padding: 0, width: 'fit-content'}} component="th" scope="row">
        <IconCloseButton onClick={handleRemove} size='small'>
          <CloseIcon />
        </IconCloseButton>
      </StyledTableCell>
      <StyledTableCell component="th" scope="row">
        {row.productNumber}
      </StyledTableCell>
      <StyledTableCell>{row.name}</StyledTableCell>
      <StyledTableCell>{`₱ ${row.price}`}</StyledTableCell>
        <StyledTableCell onClick={handleClick} style={{ cursor: 'pointer'}} align="right">{
          isClick ?
          <TextField
            type='number'
            className={classes.textField}
            id='quantity'
            style={{ width: '50px', height: '40px', padding: '2px' }}
            value={value}
            onChange={onChange}
            ref={inputRef}
          />:
          value
        }</StyledTableCell>

      <StyledTableCell align="right">{`₱ ${row.subTotal}`}</StyledTableCell>
    </StyledTableRow>
  )
}

const TotalComponent = (props) => {
  const { name, data, variant } = props;

  const classes = useStyles();
  return (
    <Box className={classes.totalCompnent}>
      <Typography variant={variant} style={{ color: colors.PRIMARY}}><strong>{name}:</strong></Typography>
      <Typography variant={variant} style={{ color: colors.PRIMARY}}><strong>{data}</strong></Typography>
    </Box>
  )
}


const NewTransactions = (props) => {
  const { data, setData, total, setTotal, discount, setDiscount, subTotal, setSubTotal, notify, id, setId } = props;

  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const { state } = useContext(AuthContext);
  const [categories, setCategories]  = useState([]);
  const [category, setCategory]  = useState('');

  const [openDiscount, setOpenDiscount] = useState(false);
  const [finalDiscount, setFinalDiscount] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [change, setChange] = useState(0);
  const [value, setValue] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [custName, setCustName] = useState('Walk-in');
  const [note, setNote] = useState('N/A');

  const [custNameError, setCustNameError] = useState(false);
  const [custIdError, setCustIdError] = useState(false);
  const [discountError, setDiscountNameError] = useState(false);
  
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');

  const [transNum, setTransNum] = useState('N/A');

  const getProps = {
    api: api.PRODUCT_CATEGORIES_BY_STORE_ID_API,
    keyword: '',
    dataFormat: createProductItem,
    columns: headCells,
    pageName: 'ProductItem',
    params: {
      storeId: parseInt(state.user.storeId)
    }
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

  const formatData = async (embedded) => {
    const productCategoryData = await Promise.all(embedded.productItems.map(async (item) => {
      const { name, price, _links, productNumber = 0, stock = 0 } = item;
      const productItemId = _links.self.href.replace(`${api.PRODUCT_ITEMS_API}/`, '');

      return getProps.dataFormat(productItemId, productNumber, name, '', price, stock, stock);
    }));

    return productCategoryData
  }

  const getData = async (value) => {

    let params = {
      ...getProps.params,
      name: keyword,
      category: value,
      productNumber: keyword,
      genericName: keyword,
      size: 100000,
      page: 0,
      sort: `name,asc`
    }

    if (!keyword) {
      params = {
        ...getProps.params,
        category: value,
        size: 100000,
        page: 0,
        sort: `name,asc`
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
      const { _embedded } = response.data;
      let formattedData = await formatData(_embedded);
      if (data.length) {
        formattedData = formattedData.map(item => {
          const filterItem = data.find(val => val.productNumber === item.productNumber);
          if (filterItem) {
            return {
              ...item,
              stock: item.stock - filterItem.quantity
            }
          }

          return item
        })
      }
      setProducts(formattedData)
      console.log('response', response)
    } catch (e) {
      console.log('Error:', e);
    } 
  }

  const getProductData = async (value) => {

    let params = {
      ...getProps.params,
      name: keyword,
      category: value,
      productNumber: keyword,
      size: 100000,
      page: 0,
      sort: `name,asc`
    }

    if (!keyword) {
      params = {
        ...getProps.params,
        category: value,
        size: 100000,
        page: 0,
        sort: `name,asc`
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
      const { _embedded } = response.data;
      let formattedData = await formatData(_embedded);
      setProducts(formattedData)
      console.log('response', response)
    } catch (e) {
      console.log('Error:', e);
    } 
  }
  
  useEffect(() => {
    getData();

    return () => {
      setProducts([])
    }
  }, [keyword]);

  const handleSearchQuery = (values) => {
    setKeyword(values);
  }

  const calculateSubTotal = (item, quantity) => ({
    ...item,
    quantity,
    subTotal: item.price * quantity,
  });
  
  const getTotal = (items) => {
    const newTotal = items.reduce((sum, item) => sum + item.subTotal, 0);
    setFinalDiscount(parseFloat((discount / 100) * newTotal).toFixed(2));
    const itemNumber = items.reduce((sum, item) => sum + item.quantity, 0);

    setSubTotal(newTotal);
    setQuantity(itemNumber);
    setTotal(parseFloat(newTotal ? newTotal - ((discount / 100) * newTotal): newTotal).toFixed(2));
  };
  
  const handleClick = (value, quantity) => {
    setData(prevData => {
      let updatedData;
      const existingItem = prevData.find(prevItem => prevItem.id === value.id);
  
      if (existingItem) {
        if (parseInt(quantity) < 1) {
          updatedData = prevData.filter(prevItem => prevItem.id !== value.id);
        } else {
          const newQty = quantity ? quantity : parseInt(existingItem.quantity) + 1;
          updatedData = prevData.map(item =>
            item.id === existingItem.id ? calculateSubTotal(item, newQty) : item
          );
        }
      } else {
        updatedData = [...prevData, calculateSubTotal(value, 1)];
      }
      getTotal(updatedData);
      return updatedData;
    });

    const newProducts = products.map(item => {
      
      if (item.productNumber === value.productNumber) {
        const currentData = data.find(dItem => dItem.productNumber === value.productNumber);
        let nStock = item.stock - 1;
        let nTempStock = item.tempStock
        console.log('first', currentData, item)
        if (quantity === 0) {
          nStock = parseInt(currentData.tempQuantity) ?  item.tempStock + (parseInt(currentData.tempQuantity)) : item.tempStock;
          nTempStock = parseInt(currentData.tempQuantity) ?  item.tempStock + (parseInt(currentData.tempQuantity)) : item.tempStock;
        } else if (quantity)  {
          nStock = parseInt(currentData.tempQuantity) > item.stock ?  item.tempStock - (parseInt(quantity) - parseInt(currentData.tempQuantity)) : item.tempStock - quantity
        } else {
          nStock =  item.stock - 1 
        }

        return {
          ...item,
          stock: nStock,
          tempStock: nTempStock
        }
      }
      return item
    })
    setProducts(newProducts);
  };

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

  const handleClickCategory = (value) => {
    let newCategory = value;
    if (category === value) {
      setCategory('');
      newCategory = ''
    } else {
      setCategory(value);
    }
    getData(newCategory);
  }

  const handleReset = () => {
    setDiscount(0);
    setTotal(0);
    setData([]);
    setSubTotal(0);
    setDeleteOpen(false);
    setValue(0);
    setChange(0);
    setNote('N/A');
    setTransNum('N/A')
    setCustName('Walk-in');
    setId(0)
    setCustomerName('');
    setCustomerId('');
  }

  const updateString = (value) => {
    if (typeof value === 'string') {
      return parseFloat(value?.replace('₱', ''))
    }

    return value;
  }

  const handleSubmit = async (stat) => {
    const newData = data.map(item => {
      return {
        productNumber: item.productNumber,
        stock: parseInt(item.quantity),
        quantity: parseInt(item.quantity),
        productItemId: item.id
      }
    });

    let payload = {
      productNumbers: newData,
      totalPrice: updateString(total),
      storeId: parseInt(state.user.storeId),
      status: stat === 0 ? 0 : 1,
      discount: updateString(discount),
      cash: updateString(value),
      change: updateString(change),
      customerName: customerName,
      customerId: customerId
    }
    
    if (id) {
      payload = {
        ...payload,
        trasactionId : id
      }
    }

    try {
      await request({
        url: id ? api.TRANSACTION_API + '/update': api.TRANSACTION_API + '/create',
        method: id ? API_METHOD.PATCH: API_METHOD.POST,
        data: payload
      })
      notify('success', `Transaction has been ${ stat === 0 ? 'save' : 'submitted'} successfully!`);
      setOrderOpen();
      handleReset();
      setProducts([]);
      setId(null);
      await getData();

    } catch (error) {
      notify('error', `Failed submitting new transaction!`);
    }

  }
  
  const handleSave = () => {
    if (!data.length) {
      notify('error', `Empty Transaction. Cannot be saved!`);
      return
    }
    handleSubmit(0)
  }

  const handleValidation = () => {
    let isValid = true;
  
    // Check discount
    if (!discount && isShowDiscount) {
      setDiscountNameError(true);
      isValid = false;
    } else {
      setDiscountNameError(false);
    }
  
    // Check customer name
    if (!customerName) {
      setCustNameError(true);
      isValid = false;
    } else {
      setCustNameError(false);
    }
  
    // Check customer ID
    if (!customerId) {
      setCustIdError(true);
      isValid = false;
    } else {
      setCustIdError(false);
    }
  
    return isValid; // You can use this flag to decide if the form is valid
  };

  const handleDiscount = () => {
    if (!handleValidation()) return

    setTotal(prev => {
      setFinalDiscount(parseFloat((discount / 100) * prev).toFixed(2));
      const newTotal = prev ? prev - ((discount / 100) * prev): prev;

      setChange(`₱${parseFloat((value - newTotal) > 0 ? (value - newTotal) : 0).toFixed(2)}`);
      return parseFloat(newTotal).toFixed(2);
    });

    setOpenDiscount(false);

  }

  const handleOpenDiscount = () => {
    setOpenDiscount(true);
    setDiscount(20);
  }

  const handleCloseDiscount = () => {
    setOpenDiscount(false);
    setDiscount(0);
    setCustomerName('')
    setCustomerId('')
    setCustNameError(false);
    setCustIdError(false);
    setDiscountNameError(false);
    setFinalDiscount(0);
  }

  const handleDiscountChange = (e) => {
    const { value } = e.target;
    const numericValue = value === "" ? "" : Math.max(0, Number(value)); // Ensure non-negative

    setDiscount(numericValue);
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
  }

  const handleOpenDeleteModal = () => {
    setDeleteOpen(true);
  }

  const handleOpenOrderModal = () => {
    setOrderOpen(true);
  }

  const handleCloseOrderModal = () => {
    setOrderOpen(false);
  }

  const handleCashInput = (val) => {
    let newVal = `${value}${val}`;
    if (val === null) {
      newVal = 0
    } else if ((val === 0 && value === 0)) {
      newVal = 0
    } else if (newVal && value === 0) {
      newVal = val;
    }
    const cash = parseInt(newVal);
    setDisabled(!(cash >= total));
    setChange(`₱${(cash - total) > 0 ? (cash - total) : 0}`);
    setValue(cash);
  }

  const handleErase = () => {
    setValue((prevValue) => {
      if (!prevValue) {
        return 0
      }
      const newValue = prevValue?.toString().slice(0, -1);
      const cash = newValue ? parseInt(newValue) : 0;
      setDisabled(!(cash >= total));
      setChange(`₱${(cash - total) > 0 ? (cash - total) : 0}`);
      return cash
    });
  }

  const getTransactionData = async () => {
    await getProductData();

    const response = await request({
      url: api.TRANSACTION_API + '/' + id,
      method: API_METHOD.GET,
    })

    const dataRes = response.data;
    const totalDis = dataRes.totalPrice/(1 - (dataRes.discount/100));

    setFinalDiscount(parseFloat(totalDis - dataRes.totalPrice).toFixed(2));
    const itemQuantity = dataRes.productNumbers.reduce((sum, item) => sum + (item.quantity), 0);
    setSubTotal(totalDis);
    setQuantity(itemQuantity);
    setTotal(dataRes.totalPrice);
    setCustomerName(dataRes.customerName);
    setCustomerId(dataRes.customerId);

    if (dataRes.reservation) {
      const name = dataRes.reservation.user?.lastName + ', ' + dataRes.reservation.user?.firstName;
      setCustName(name);
      setNote(dataRes.reservation.reference ? `#${dataRes.reservation.reference}` : '--');
      setTransNum(dataRes.transactionNum)
    }

    const newData = dataRes.productNumbers.map(item => {
      const price = item.quantity * item.price;

      return {
        ...item,
        id: item.productItemId + "",
        subTotal: price,
        tempQuantity: item.quantity
      }
    });
    setData(newData);
  }

  useEffect(() => {
    getCategoryData();
  }, [])

  useEffect(() => {
    if (id) {
      getTransactionData();
    }
  }, [id])

  const handleChangeCustomerName = (value) => {
    setCustName(value.target.value);
    setCustomerName(value.target.value)
  }

  const handleChangeCustomerIdChange = (value) => {
    setCustomerId(value.target.value);
  }

  const [isShowDiscount, setIsShowDiscount] = useState(false);

  const handleClickDiscount = (val) => {
    let disc = val ? 0 : 20;

    setDiscount(disc);
    setIsShowDiscount(val);
  }

  return (  
    <>
      <Modal
        open={openDiscount} 
        handleClose={handleCloseDiscount} 
        handleSubmit={() => handleDiscount()} 
        buttonName='Add'
        image={discountIcon}
        title='Add Discount'
      >
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <TextField
            fullWidth
            id="customerName"
            label={'Customer Name*'}
            name="customerName"
            value={customerName}
            onChange={handleChangeCustomerName}
            error={custNameError}
            helperText={custNameError && REQUIRED_FIELD}
          />
          <TextField
            fullWidth
            id="customerId"
            label={'Customer ID*'}
            name="customerId"
            value={customerId}
            onChange={handleChangeCustomerIdChange}
            error={custIdError}
            helperText={custIdError && REQUIRED_FIELD}
          />
          {
             isShowDiscount ?
             <OutlinedInput
                id="outlined-adornment-weight"
                value={discount}
                fullWidth
                name='discount'
                type='number'
                onChange={handleDiscountChange}
                onKeyDown={handlePreventNegative}
                error={discountError}
                helperText={REQUIRED_FIELD}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  'aria-label': 'discount',
                }}
                labelWidth={0}
              />
             : 
             <Typography>Senior/PWD Discount: 20%</Typography>
          }

          <Link style={{ cursor: 'pointer', color: colors.PRIMARY, textDecoration: 'underline'}} onClick={() => handleClickDiscount(!isShowDiscount)}>{ isShowDiscount ? 'Use PWD/Senior Discount' : 'Custom discount'}</Link>
        </Box>
      </Modal>
      <ModalSummary
        open={orderOpen} 
        handleClose={handleCloseOrderModal} 
        handleSubmit={handleSubmit} 
        buttonName='Confirm'
        image={logo}
        title='Order Summary'
        quantity={quantity}
        subTotal={subTotal} 
        total={total}
        finalDiscount={finalDiscount}
        change={change}
        discount={discount}
        value={value}
        handleCashInput={handleCashInput}
        handleErase={handleErase}
        disabled={disabled}
      />
      <Modal 
        open={deleteOpen} 
        handleClose={handleCloseDeleteModal} 
        handleSubmit={handleReset} 
        buttonName='Yes'
        image={cancelIcon}
        title='Cancel Transaction'
      >
        <Box className={classes.deleteContent}>
          Are you sure you want to cancel this transaction?
        </Box>
      </Modal>
      <Grid container style={{ marginTop: '0px', height: '100%'}}>
        <Grid item lg={9} md={9} sm={12} xs={12}>
          <TableContainer style={{height: '100%', minHeight: '500px'}} className={classes.tablePaper} component={Paper}>
            <Table stickyHeader sx={{ minWidth: 650 }} 
            
            aria-label="simple table">
              <TableHead 
                // style={{ position: 'fixed' }}
                >
                <StyledTableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell><strong>Product Number</strong></StyledTableCell>
                  <StyledTableCell><strong>Product Name</strong></StyledTableCell>
                  <StyledTableCell><strong>Price</strong></StyledTableCell>
                  <StyledTableCell align="right"><strong>Quantity</strong></StyledTableCell>
                  <StyledTableCell align="right"><strong>Subtotal</strong></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
              {data.map((row) => (
                <TrasactionContent row={row} handleClick={handleClick}/>
              ))}
            </TableBody>
            </Table>
            {
                  !data.length ?
                    <Container style={{display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '80%',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: colors.PRIMARY}}>
                      <img className={classes.image} src={emptyLogo} alt='Icon logo' style={{ width: '200px'}} />
                      Currenty Empty
                    </Container>
                  : 
                  <></>
                }
          </TableContainer>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <Paper sx={{ boxShadow: 4 }} style={{height: '100%', marginTop: '16px', borderRadius: '4px 4px 0 0', border: '0.5px solid rgba(224, 224, 224, 1)'}} className={classes.paper}>
            <SearchBar handleSearchQuery={handleSearchQuery} isFilter/>
            <Select menuItem={categories} label='Filter by category' isFilter value={category} handleClick={handleClickCategory}/>
            <List disablePadding >
              <ListItem disablePadding className={classes.listTitle}>
                <ListItemText primary='Product Name' />
                <ListItemText className={classes.price} primary='Price' />
              </ListItem>
            </List>
            <List disablePadding style={{ paddingBottom: '16px', height: '320px', overflow: 'scroll'}}>
              {
                products.map((item, index) => {
                  return (
                    <ListItem className={item.stock <= 0 ? classes.disabledList: classes.list} disablePadding>
                      <ListItemButton disabled={item.stock <= 0} onClick={() => handleClick(item)}>
                        <ListItemText primary={`${item.stock <= 0 ? item.name + ' (Out of stock)': item.name}`}></ListItemText>
                        <ListItemText className={classes.price} primary={`₱ ${item.price}`} />
                      </ListItemButton>
                    </ListItem>
                  )    
                })
              }
            </List>
          </Paper>
        </Grid>
        <Grid item lg={9} md={9} sm={12} xs={12}>      
          <Paper className={classes.totalPaper}>
            <Grid container style={{ margin : 0 }}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Box>
                  <Box className={classes.customerInfo}>
                    <Typography variant='p' style={{ color: colors.PRIMARY}}><strong>Customer Name: </strong></Typography>
                    <Typography variant='p' style={{ color: colors.PRIMARY}}><strong>{custName}</strong></Typography>
                  </Box>
                  <Box className={classes.customerInfo}>
                    <Typography variant='p' style={{ color: colors.PRIMARY}}><strong>Payment Reference: </strong></Typography>
                    <Typography variant='p' style={{ color: colors.PRIMARY}}><strong>{note}</strong></Typography>
                  </Box>
                  <Box className={classes.customerInfo}>
                    <Typography variant='p' style={{ color: colors.PRIMARY}}><strong>Transaction #: </strong></Typography>
                    <Typography variant='p' style={{ color: colors.PRIMARY}}><strong>{transNum}</strong></Typography>
                  </Box>
                </Box>
              </Grid>     
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Box style={{ width: 'auto'}}>
                  <TotalComponent name='Subtotal' data={`₱${subTotal}`} variant='p'/>
                  <TotalComponent name='Discount' data={`-${total ? '₱'+finalDiscount: discount+'%'}`} variant='p'/>
                  <TotalComponent name='Tax' data={0} variant='p'/>
                  <TotalComponent name='Total' data={`₱${total}`} variant='h4'/>
                </Box>
              </Grid>     
            </Grid>
          </Paper>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <Paper className={classes.actionButtons}>
            <Box>
              <IconButton title='Discount' icon={<LocalOffer fontSize='large' />} handleClick={handleOpenDiscount} />
              <IconButton title='Save' icon={<Save fontSize='large' />} handleClick={handleSave} />
              <IconButton title='Cancel' icon={<Block fontSize='large' />} handleClick={handleOpenDeleteModal} />
            </Box>
            <Box className={classes.submitContainer}>
              <Tooltip title='Place Order'>
                <Button disabled={!data.length} variant='contained' className={classes.actionSubmit} onClick={handleOpenOrderModal}>
                Place Order
                </Button>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>  
  )
}

const Transactions = (props) => {
  const { notify } = props;

  const history = useHistory();
  const { pathname } = history.location;

  const classes = useStyles();
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [id, setId] = useState(0);

  useEffect(() => {
    if (pathname.includes('update-items')) {
      const splitPath = pathname.split('/');
      let transactionId = splitPath.length ? splitPath[splitPath.length - 1] : 0;
      setId(parseInt(transactionId));
    }
  }, [pathname]);

  return (
    <Container className={classes.container} style={{paddingTop: '16px'}}>
      <NewTransactions data={data} setData={setData} total={total} setTotal={setTotal}
        discount={discount} setDiscount={setDiscount}
        subTotal={subTotal} setSubTotal={setSubTotal} notify={notify}
        id={id} setId={setId}
      />
    </Container>
  )
}

export default Transactions
import { Button, FormControlLabel, IconButton as IconBtn, FormGroup, Link, Switch, TablePagination } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
// import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import * as React from 'react';
import useStyles from './styles';
import { Block, Check, Edit, ShoppingCartCheckout, ThumbDown, Update } from '@mui/icons-material';
import IconButton from '../icon-button';
import Loading from '../loading';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import Empty from '../empty';
import SkeletonRow from './table-skeleton';
import colors from '../../themes/colors';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableHead = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, name } =
    props;

  const classes = useStyles();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id + idx}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={`${headCell.primaryHeader ? classes.primaryHeader : ''} ${headCell.id === 'action' && classes.action}`}
          >
            {
              headCell.isSort ?
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                  className={classes.tableSortLabel}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              :
                  <Box className={classes.tableSortLabel}>
                    {headCell.label}
                  </Box>
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, handleDelete } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        {numSelected} selected
      </Typography>
      <Tooltip title="Delete">
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired
};

const ActionColumn = (props) => {
  const { handleSingleDelete, handleUpdate, name, row, disable } = props;
  const classes = useStyles();
  const { state } = useContext(AuthContext);
  const { user } = state;

  const isDisable = (user.role.name === 'PCASHIER' && name === 'TransactionHistory');
  return (
    <Box className={classes.actionButton}>
      <Tooltip title={name === 'Reservation' ? 'Accept' : 'Update'}>
      <IconBtn
        aria-label="Update"
        style={{ color: colors.PRIMARY}}
        onClick={(e) => handleUpdate(e, row)}
        disable={disable}
      >
        <Edit fontSize='medium' />
      </IconBtn>
        {/* <Button disable={disable} onClick={(e) => handleUpdate(e, row)} variant="contained" className={disable ? classes.actionDisable :classes.actionUpdateButton}
          startIcon={<Edit fontSize='small' />}>
        Update
        </Button> */}
      </Tooltip>
      <Tooltip title={name === 'Reservation'? 'Reject': 'Delete'}>
        <IconBtn
          style={{ color: colors.ERROR}}
          aria-label="Delete"
          onClick={(e) => handleSingleDelete(e, row, 'single')}
          disable={disable || isDisable}
        >
          <DeleteIcon fontSize='medium' />
        </IconBtn>
        {/* <Button disable={disable || isDisable} onClick={(e) => handleSingleDelete(e, row, 'single')} variant="contained"  className={disable || isDisable ? classes.actionDisable :classes.actionDeleteButton}
          startIcon={<DeleteIcon fontSize='small' />}>
        Delete
        </Button> */}
      </Tooltip>
    </Box>
  )
}

const ReservationActionColumn = (props) => {
  const { handleSingleDelete, handleUpdate, name, row, disable } = props;
  const classes = useStyles();
  const { state } = useContext(AuthContext);
  const { user } = state;

  console.log('status: ', row['status'])

  if (row['status'] === 'Void') {
    return (
      <Box style={{textAlign: 'center'}}>
        --
      </Box>
    )
  }

  return (
    <Box className={classes.actionButton} style={{justifyContent: 'center'}}>
    {
      row['status'].includes('Pending') ?
        <Tooltip title={'Accept'}>
          <IconBtn
            aria-label="Update"
            onClick={(e) => handleUpdate(e, row, 'approve')}
            disable={disable}
          >
            <Check fontSize='medium' />
          </IconBtn>
        </Tooltip>
        :
        <Tooltip title={'Proceed'}>
          <IconBtn
            aria-label="Update"
            disabled={row['status'] === 'Received' || row['status'] === 'Rejected'}
            style={row['status'] === 'Received' || row['status'] === 'Rejected' ? {color: colors.GRAY }: { color: colors.PRIMARY}}
            onClick={(e) => handleUpdate(e, row, 'checkout')}
            disable={disable}
          >
            <ShoppingCartCheckout fontSize='medium' />
          </IconBtn>
        </Tooltip>
      }
      {
        row['status'].includes('Pending') ?
          <Tooltip title={'Reject'}>
            <IconBtn
              aria-label="Delete"
              style={{ color: colors.ERROR}}
              onClick={(e) => handleSingleDelete(e, row, 'reject')}
              disable={disable}
            >
              <ThumbDown fontSize='medium' />
            </IconBtn>
          </Tooltip>
        :
        <Tooltip title={'Delete'}>
          <IconBtn
            aria-label="Delete"
            style={{ color: colors.ERROR}}
            onClick={(e) => handleSingleDelete(e, row, 'single')}
            disable={disable}
          >
            <DeleteIcon fontSize='medium' />
          </IconBtn>
        </Tooltip>

      }

    </Box>
  )
}

const ActionTrasactionColumn = (props) => {
  const { handleSingleDelete, handleUpdate, name, row, disable } = props;
  const classes = useStyles();
  const { state } = useContext(AuthContext);
  const { user } = state;

  const isDisable = (user.role.name === 'PCASHIER' && name === 'TransactionHistory');

  console.log('status: ', row['status'])

  if (row['status'] === 'Void') {
    return (
      <Box style={{textAlign: 'center'}}>
        --
      </Box>
    )
  }

  return (
    <Box className={classes.actionButton} style={{justifyContent: 'center'}}>
    {
      row['status'] !== 'Void' ?
        <Tooltip title={row['status'] === 'Draft' ? 'Update' : 'Void'}>
          <IconBtn
            aria-label="Update"
            style={row['status'] === 'Draft' ? { color: colors.PRIMARY} : { color: colors.ERROR}}
            onClick={(e) => handleUpdate(e, row, row['status'] === 'Draft' ? 'update' : 'void' )}
            disable={disable}
          >
            {
              row['status'] === 'Draft'? 
              <Edit fontSize='medium' />
              :
              <Block fontSize='medium' />
            }
          </IconBtn>
        </Tooltip>
        :
        <></>
      }
      {
        row['status'] === 'Draft'?
          <Tooltip title={'Delete'}>
            <IconBtn
              aria-label="Delete"
              style={{ color: colors.ERROR}}
              onClick={(e) => handleSingleDelete(e, row, 'single')}
              disable={disable || isDisable}
            >
              <DeleteIcon fontSize='medium' />
            </IconBtn>
          </Tooltip>
        :
        <></>

      }

    </Box>
  )
}

const TableContent = (props) => {
  const { row, labelId, handleSingleDelete, handleUpdate, name, handleStatusChange, handleApprove } = props;
  const { state } = useContext(AuthContext);
  const classes = useStyles();
  return (
    <>
      {
        Object.keys(row).map(key => {
          return (
            <>
              {
                name === 'Reservation' ||  name === 'TransactionHistory'  ? 
                  <>
                  {  key === 'id' ?
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                      {row.id}
                      </TableCell>
                      :
                     
                    <>
                      {
                        key === 'transactionId' || key === 'reservationId' ?
                          <></>
                        :
                          <TableCell className={`${typeof row[key] == 'string' && (row[key]?.includes('Out of stock') || row[key]?.includes('Expired') || row[key]?.includes('Rejected')) ? classes.outOfStock: ''} ${row[key] === 'Draft'&& classes.italic}`} align="left">{row[key]}</TableCell>
                      } 
                    </>
                    }    
                  </>
                :
                  <>
                  {  key === 'id' ?
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                      {row.id}
                      </TableCell>
                      :
                    name === 'Stores' && key === 'status' ?
                    <TableCell
                        align="left"
                      >
                        <FormGroup style={{ width: '100%' }}>
                          <FormControlLabel color='primary' control={<Switch onChange={() => handleStatusChange({...row, status: parseInt(row[key]) === 1})} checked={parseInt(row[key]) === 1} />} />
                        </FormGroup>
                      </TableCell>
                    :
                      <TableCell className={`${typeof row[key] == 'string' && row[key]?.includes('Out of stock') ? classes.outOfStock: ''} ${(row[key] === 'Draft' || row[key] === 'Deleted user')&& classes.italic}`} align="left">{row[key]}</TableCell>
                    }    
                  </>
                }
            </>
          )
        })
      }
      {
        name === 'Users' && parseInt(row.id) === state.user.userId && name != 'AuditLogs' ?
          <TableCell
            component="th"
            id={labelId}
            scope="row"
            sx={{
              '& [aria-label="Delete"]': {
                color: '#969696 !important',
              },
            }}
            style={{display: 'flex', justifyContent: 'flex-start' }}
          >
            <ActionColumn disable row={row} handleSingleDelete={()=>{}} handleUpdate={handleUpdate}/>
          </TableCell>
        : name === 'Users' && parseInt(row.id) !== state.user.userId ?
          <TableCell
            component="th"
            id={labelId}
            scope="row"
            style={{display: 'flex', justifyContent: 'flex-start'}}
          >
            <ActionColumn row={row} handleSingleDelete={handleSingleDelete} handleUpdate={handleUpdate}/>
          </TableCell>
          : <></>
      }
      {
        name === 'TransactionHistory' && name != 'AuditLogs' ?
        <>
          <TableCell
              component="th"
              id={labelId}
              scope="row"
            >
            <ActionTrasactionColumn row={row} handleSingleDelete={handleSingleDelete} handleUpdate={handleUpdate} name={name}/>
          </TableCell>
        </>
      :
        <></>
      }
      {
        name === 'Reservation' && name != 'AuditLogs'?
        <>
          <TableCell
              component="th"
              id={labelId}
              scope="row"
            >
            <ReservationActionColumn row={row} handleApprove={handleApprove} handleSingleDelete={handleSingleDelete} handleUpdate={handleUpdate} name={name}/>
          </TableCell>
        </>
      :
        <></>
      }

      {
        name !== 'Users' && name != 'Recent Reservation' && name != 'Reservation' && name != 'TransactionHistory' && name != 'AuditLogs'?
          <TableCell
            component="th"
            id={labelId}
            scope="row"
            
            style={{display: 'flex', justifyContent: 'flex-start'}}
          >
            <ActionColumn row={row} handleSingleDelete={handleSingleDelete} handleUpdate={handleUpdate} name={name}/>
          </TableCell>
        :
          <></>
      }
    </>
  )
}

const EnhancedTable = (props) => {
  const { rows, headCells, page, rowsPerPage, orderBy, order, isLoading,
    handleRequestSort, handleChangePage, handleChangeRowsPerPage, name, handleView, handleDelete, totalItems,
    title, header, onUpdate, handleStatusChange, onApprove } = props;

  const classes = useStyles();

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleUpdate = (event, item, type) => {
    event.stopPropagation();
    onUpdate(item, type);
  }

  const handleApprove =(event, item, type) => {
    event.stopPropagation();
    onApprove(item, type);
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleMultipleDelete = () => {
    handleDelete(selected, 'multiple')
  }

  const handleSingleDelete = (event, item, type) => {
    event.stopPropagation();
    event.preventDefault();

    handleDelete(item, type);
    setSelected([]);
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );


  const getDisabledProp = () => {
    return {
      disabled: isLoading
    }
  }

  const getCustomProp = () => {
    return isLoading && getDisabledProp()
  }
  const columnKeys = Object.keys(headCells.filter(column => !column.hidden));
  const NHeaderCells = headCells.filter(headCell => !headCell.isHidden);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper className={classes.paper} sx={{ width: '100%', mb: 2, boxShadow: 4 }}>
        {
          title ?
          <Typography variant='h5' style={{padding: '8px', paddingLeft: 0}}>{title}</Typography>
          : 
          <></>
        }
        {
          header ? 
          header
        :
          <></>
        }
        {
          selected.length ?
            <EnhancedTableToolbar numSelected={selected.length}  handleDelete={handleMultipleDelete}/>
          :
          <></>
        }
        {
          isLoading ?
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size='medium'
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                  headCells={NHeaderCells}
                  name={name}
                />
                <SkeletonRow
                  columnKeys={columnKeys}
                  columns={headCells}
                  ROWS_PER_PAGE={10}
                />
              </Table>
            </TableContainer>
          :
          <>
            <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='medium'
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={NHeaderCells}
                name={name}
              />
              <TableBody>
                {rows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      sx={{ cursor: 'pointer' }}
                    >
                      {
                        name === '' ?
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                        :
                        <></>
                      }
                      <TableContent labelId={labelId} row={row} name={name} handleView={handleView} 
                        handleUpdate={handleUpdate}  handleApprove={handleApprove} handleSingleDelete={handleSingleDelete} handleStatusChange={handleStatusChange}/>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {rows.length === 0 && (
            <Box className={classes.empty}>
              <Empty />
            </Box>
          )}
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            backIconButtonProps={getCustomProp()}
            nextIconButtonProps={getCustomProp()}
          />
          </>
        }
      </Paper>
    </Box>
  );
}

export default EnhancedTable;
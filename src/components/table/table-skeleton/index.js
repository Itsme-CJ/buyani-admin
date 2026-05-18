import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';

const SkeletonRow = (props) => {
  const { columnKeys, columns, ROWS_PER_PAGE } = props;

  const skeletonColumns = columns.filter(column => !column.hidden);
  return (
    <TableBody>
      {
        [...Array(ROWS_PER_PAGE)].map((row, x) =>
          < TableRow key={'empty-tr-' + row + x} >
            {
              columnKeys.map((col, y) =>
                <TableCell 
                  key={'empty-' + x + '-' + y}
                >
                  {
                    skeletonColumns[y].label === 'action' ?
                      <></>
                    :
                      <Skeleton variant='text' />
                  }
                </TableCell>
              )
            }
          </TableRow >
        )
      }
    </TableBody>
  )
}

export default SkeletonRow;
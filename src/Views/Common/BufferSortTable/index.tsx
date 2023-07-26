import {
  Skeleton,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TableBody,
} from '@mui/material';
import { ReactNode, useMemo, useState } from 'react';
import { createArray } from '@Utils/JSUtils/createArray';
import Background from '@Views/Common/BufferTable/style';
import BasicPagination from '@Views/Common/pagination';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: string;
  label: string;
}

export default function BufferSortTable({
  headerJSX,
  bodyJSX,
  loading,
  isBodyTransparent = false,
  shouldHideBody = false,
  cols,
  rows,
  selectedIndex,
  bluredIndexes,
  onRowClick,
  widths,
  error,
  data,
  defaultSortId,
  defaultOrder = 'asc',
  shouldShowMobile = false,
  activePage = 1,
  count,
  onPageChange,
}: {
  data: any[];
  headerJSX: HeadCell[];
  bodyJSX: (row: number, col: number, sortedData: any[]) => React.ReactChild;
  loading?: boolean;
  isBodyTransparent?: boolean;
  shouldHideBody?: boolean;
  cols: number;
  rows: number;
  selectedIndex?: number;
  bluredIndexes?: number[];
  onRowClick: (idx: number) => void;
  widths?: string[];
  error?: ReactNode;
  defaultSortId: string;
  defaultOrder?: Order;
  shouldShowMobile?: boolean;
  count?: number;
  onPageChange?:
    | ((event: React.ChangeEvent<unknown>, page: number) => void)
    | undefined;
  activePage?: number;
}) {
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState<string>(defaultSortId);
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const sortedData = useMemo(
    () => data.sort(getComparator(order, orderBy)),
    [data, order, orderBy]
  );

  let rowClass = '';
  let tableCellCls = 'table-cell';

  return (
    <Background shouldShowMobile={shouldShowMobile && window.innerWidth < 1200}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead className={`table-header`}>
            <TableRow className={`table-row-head`}>
              {headerJSX.map((headCell) => (
                <TableCell key={headCell.id} className="table-head">
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="table-body">
            {loading ? (
              <TableRow
                className={`table-row skel ${
                  isBodyTransparent ? 'transparent transparent-hover' : ''
                }`}
              >
                <TableCell className="skel-cell" colSpan={100}>
                  <Skeleton className="skel" />
                </TableCell>
              </TableRow>
            ) : shouldHideBody ? (
              <></>
            ) : rows ? (
              createArray(rows).map((row, rowIdx) => {
                let rowClass = '';
                if (selectedIndex === rowIdx) {
                  rowClass = 'active';
                } else if (
                  selectedIndex !== null &&
                  selectedIndex !== undefined
                ) {
                  rowClass = 'blured';
                }
                if (bluredIndexes && bluredIndexes.length) {
                  for (let i of bluredIndexes) {
                    if (row === i) {
                      rowClass = 'blured';
                    }
                  }
                }
                return (
                  <TableRow
                    key={row}
                    className={`table-row ${rowClass} ${
                      isBodyTransparent ? 'transparent transparent-hover' : ''
                    }`}
                    onClick={() => onRowClick(row)}
                  >
                    {createArray(cols).map((col, colIdx) => (
                      <TableCell
                        key={row.toString() + colIdx}
                        className={tableCellCls}
                        width={
                          widths && colIdx < widths.length ? widths[colIdx] : ''
                        }
                      >
                        {bodyJSX(row, col, sortedData)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow
                className={`table-row ${rowClass}  disable-animation ${
                  isBodyTransparent ? 'transparent' : ''
                }`}
              >
                <TableCell className={tableCellCls} colSpan={100}>
                  {error}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {count && count > 1 ? (
          <BasicPagination
            onChange={onPageChange}
            count={count}
            page={activePage}
          />
        ) : null}
      </TableContainer>
    </Background>
  );
}

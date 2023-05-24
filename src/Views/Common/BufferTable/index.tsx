import Background from './style';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@mui/material';
import { createArray } from '@Utils/JSUtils/createArray';
import { ReactNode } from 'react';
import BasicPagination from '../pagination';

const BufferTableRow = ({ children, onClick, className }) => (
  <TableRow className={'table-row ' + className} onClick={onClick}>
    {children}
  </TableRow>
);

const BufferTableCell = ({ children, onClick }) => (
  <TableCell className="table-cell " onClick={onClick}>
    {children}
  </TableCell>
);

interface IBufferTable {
  cols: number;
  rows: number;
  topDecorator?: ReactNode;
  headerJSX: (idx: number) => React.ReactChild;
  bodyJSX: (row: number, col: number) => React.ReactChild;
  interactive?: boolean;
  v1?: boolean;
  lastColWidth?: string;
  selectedIndex?: number;
  widths?: string[];
  onRowClick: (idx: number) => void;
  error?: ReactNode;
  bluredIndexes?: number[];
  highlightIndexs?: number[];
  loading?: boolean;
  smHeight?: boolean;
  count?: number;
  tableBodyClass?: string;
  shouldShowMobile?: boolean;
  shouldHideHeader?: boolean;
  shouldHideBody?: boolean;
  tableClass?: string;
  overflow?: boolean;
  isBodyTransparent?: boolean;
  className?: string;
  doubleHeight?: boolean;
  onPageChange?:
    | ((event: React.ChangeEvent<unknown>, page: number) => void)
    | undefined;
  activePage?: number;
}

const BufferTable: React.FC<IBufferTable> = ({
  cols,
  headerJSX,
  rows,
  bodyJSX,
  topDecorator,
  widths,
  smHeight,
  selectedIndex,
  onRowClick,
  error,
  tableClass,
  loading,
  count,
  bluredIndexes,
  tableBodyClass,
  overflow = false,
  v1 = false,
  onPageChange = undefined,
  shouldShowMobile = false,
  shouldHideHeader = false,
  shouldHideBody = false,
  isBodyTransparent = false,
  className,
  doubleHeight = false,
  highlightIndexs,
  activePage = 1,
}) => {
  let rowClass = '';
  let tableCellCls = 'table-cell';
  if (smHeight) tableCellCls += ' sm';
  if (doubleHeight) tableCellCls += ' double-height';
  if (rows > 100) {
    rows = 100;
  }
  return (
    <Background
      v1={v1}
      className={`${className} ${shouldShowMobile ? '' : 'tab-none'}
      `}
      shouldShowMobile={shouldShowMobile}
    >
      <TableContainer sx={{ height: '100%' }}>
        <Table
          stickyHeader
          className={`${tableClass} table ${
            shouldShowMobile ? '' : 'tab-none'
          } `}
          aria-label="buffer-table"
        >
          <TableHead
            className={`table-header ${shouldHideHeader ? 'tab' : ''} `}
          >
            <TableRow className={`table-row-head`}>
              {createArray(cols).map((idx) => {
                return (
                  <TableCell key={idx} className="!z-20">
                    {headerJSX(idx)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody className={'table-body ' + tableBodyClass}>
            {topDecorator}

            {loading ? (
              <TableRow
                className={`table-row skel ${rowClass} ${
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
                if (highlightIndexs && highlightIndexs.length) {
                  for (let i of highlightIndexs) {
                    if (row === i) {
                      rowClass = 'highlight';
                    }
                  }
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
                    className={`group table-row ${rowClass} ${
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
                        {bodyJSX(row, col)}
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
};

export default BufferTable;
export { BufferTableRow, BufferTableCell };

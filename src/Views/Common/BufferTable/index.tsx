import { createArray } from '@Utils/JSUtils/createArray';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import BasicPagination from '../pagination';
import Background from './style';

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
  accordianJSX?: (row: number) => React.ReactChild;
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
  showOnly?: number[];
  shouldShowMobile?: boolean;
  shouldHideHeader?: boolean;
  shouldHideBody?: boolean;
  tableClass?: string;
  overflow?: boolean;
  isBodyTransparent?: boolean;
  isHeaderTransparent?: boolean;
  className?: string;
  doubleHeight?: boolean;
  onPageChange?:
    | ((event: React.ChangeEvent<unknown>, page: number) => void)
    | undefined;
  activePage?: number;
  shouldOnlyRenderActivePageAndArrows?: boolean;
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
  showOnly,
  error,
  tableClass,
  loading,
  count,
  bluredIndexes,
  tableBodyClass,
  overflow,
  v1 = false,
  onPageChange = undefined,
  shouldShowMobile = false,
  shouldHideHeader = false,
  shouldHideBody = false,
  isBodyTransparent = false,
  isHeaderTransparent = false,
  className,
  doubleHeight = false,
  highlightIndexs,
  activePage = 1,
  accordianJSX,
  shouldOnlyRenderActivePageAndArrows,
}) => {
  let rowClass = '';
  let tableCellCls = 'table-cell';
  if (smHeight) tableCellCls += ' sm';
  if (doubleHeight) tableCellCls += ' double-height';
  if (rows > 100) {
    rows = 100;
  }
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRowExpansion = (rowIdx: number) => {
    if (expandedRows.includes(rowIdx)) {
      // If the row is already expanded, collapse it
      setExpandedRows(expandedRows.filter((idx) => idx !== rowIdx));
    } else {
      // If the row is collapsed, expand it
      setExpandedRows([...expandedRows, rowIdx]);
    }
  };

  return (
    <Background
      overflow={overflow}
      isBodyTransparent={isBodyTransparent}
      className={` ${className} ${shouldShowMobile ? '' : 'tab-none'}
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
          {headerJSX && (
            <TableHead
              className={`${
                isHeaderTransparent ? '!bg-[#232334] transparent-hover' : ''
              } table-header ${shouldHideHeader ? 'tab' : ''} `}
            >
              <TableRow className={` table-row-head`}>
                {createArray(cols).map((idx) => {
                  let show = true;
                  if (showOnly) show = showOnly.includes(idx);
                  return (
                    <TableCell
                      key={idx}
                      className={` ${show ? '' : '!hidden'}  ${
                        isHeaderTransparent
                          ? '!bg-[#232334] transparent-hover'
                          : ''
                      } !z-10`}
                    >
                      {headerJSX(idx)}
                    </TableCell>
                  );
                })}
                {accordianJSX && <TableCell></TableCell>}
              </TableRow>
            </TableHead>
          )}
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
              createArray(rows).map((rowIdx) => (
                <>
                  {/* Data Row */}
                  <TableRow
                    key={rowIdx}
                    className={`group table-row  ${rowClass} ${
                      isBodyTransparent ? 'transparent transparent-hover' : ''
                    }`}
                    onClick={() => {
                      onRowClick(rowIdx);
                      if (!!accordianJSX) {
                        toggleRowExpansion(rowIdx);
                      }
                    }}
                  >
                    {createArray(cols).map((col, colIdx) => (
                      <TableCell
                        key={rowIdx.toString() + colIdx}
                        className={
                          tableCellCls +
                          ` ${
                            showOnly
                              ? showOnly.includes(colIdx)
                                ? ''
                                : '!hidden'
                              : ''
                          }`
                        }
                        width={
                          widths && colIdx < widths.length ? widths[colIdx] : ''
                        }
                      >
                        {bodyJSX(rowIdx, col)}
                      </TableCell>
                    ))}

                    {accordianJSX && (
                      <TableCell className={tableCellCls}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="23"
                          viewBox="0 0 20 23"
                          fill="none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(rowIdx);
                          }} // Toggle the row when SVG is clicked
                          style={{ cursor: 'pointer' }}
                          // className={`rotate ${
                          //   expandedRows.includes(rowIdx) ? 'rotate-180' : ''
                          // }`}
                        >
                          <path
                            d="M0 4.9141C0 2.20012 2.20012 0 4.9141 0H14.8206C17.5346 0 19.7347 2.20012 19.7347 4.9141V17.1888C19.7347 19.9027 17.5346 22.1029 14.8206 22.1029H4.9141C2.20012 22.1029 0 19.9027 0 17.1888V4.9141Z"
                            fill="#141823"
                          />
                          <path
                            d="M12.2139 8.96231L9.76607 11.3694L7.38332 8.89784L6.63134 9.63891L9.74596 12.8767L11.3459 11.2999L12.9459 9.72318L12.2139 8.96231Z"
                            fill="#94A3B8"
                            stroke="#94A3B8"
                            strokeWidth="0.907097"
                          />
                        </svg>
                      </TableCell>
                    )}
                  </TableRow>

                  {/* Accordion Row */}
                  {accordianJSX && expandedRows.includes(rowIdx) && (
                    <TableRow className="table-row rounded-lg mt-2">
                      <TableCell colSpan={100} className={tableCellCls}>
                        {/* Render your accordion content here */}
                        <div
                          className={`accordion-content ${
                            expandedRows.includes(rowIdx) ? 'open' : ''
                          }`}
                        >
                          {accordianJSX(rowIdx)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
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
            shouldOnlyRenderActivePageAndArrows={
              shouldOnlyRenderActivePageAndArrows
            }
          />
        ) : null}
      </TableContainer>
    </Background>
  );
};

export default BufferTable;
export { BufferTableCell, BufferTableRow };

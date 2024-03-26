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
import { useAutoAnimate } from '@formkit/auto-animate/react';

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
  smThHeight?: boolean;
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
  noHover?: boolean;
}
interface IBufferTableCopy {
  cols: number;
  rows: number;
  topDecorator?: ReactNode;
  headersJSX: string[];
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
  smThHeight?: boolean;
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
  noHover?: boolean;
  customIdx: number;
  customRow: ReactNode;
  selectedRow: number | null;
  isAboveSelected: boolean | null;
}
const isValueAvailable = (a: any) => {
  if (a !== undefined && a !== null && a != -1) {
    return true;
  }
  return false;
};

const BufferTable: React.FC<IBufferTable> = ({
  cols,
  headerJSX,
  rows,
  bodyJSX,
  topDecorator,
  widths,
  smHeight = false,
  smThHeight = false,
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
  noHover = false,
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
              className={` ${noHover ? 'no-hover' : 'transparent-hover'} ${
                isHeaderTransparent ? '!bg-[transparent]' : ''
              } table-header ${shouldHideHeader ? 'tab' : ''} `}
            >
              <TableRow className={` table-row-head`}>
                {createArray(cols).map((idx) => {
                  let show = true;
                  if (showOnly) show = showOnly.includes(idx);
                  return (
                    <TableCell
                      width={widths && idx < widths.length ? widths[idx] : ''}
                      key={idx}
                      className={` ${show ? '' : '!hidden'}  ${
                        smThHeight ? 'th-head ' : ''
                      }  ${noHover ? 'no-hover' : 'transparent-hover'}  ${
                        isHeaderTransparent ? '!bg-[transparent]' : ''
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
                className={`table-row skel ${rowClass}  ${
                  noHover ? 'no-hover' : 'transparent-hover'
                } ${isBodyTransparent ? 'transparent' : ''}`}
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
                      noHover ? 'no-hover' : 'transparent-hover'
                    } ${isBodyTransparent ? 'transparent' : ''}`}
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
                className={`table-row ${rowClass} disable-animation ${
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

const BufferTableCopy: React.FC<IBufferTableCopy> = ({
  cols,
  headersJSX,
  rows,
  bodyJSX,
  topDecorator,
  widths,
  smHeight = false,
  smThHeight = false,
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
  noHover = false,
  customRow,
  selectedRow,
  isAboveSelected,
  customIdx,
}) => {
  let rowClass = '';
  let tableCellCls = 'table-cell';
  if (smHeight) tableCellCls += ' sm';
  if (doubleHeight) tableCellCls += ' double-height';
  if (rows > 100) {
    rows = 100;
  }
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [animationParent] = useAutoAnimate();

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
          }  !border-spacing-[0px]`}
          aria-label="buffer-table"
          ref={animationParent}
        >
          <TableHead
            className={` ${noHover ? 'no-hover' : 'transparent-hover'} ${
              isHeaderTransparent ? '!bg-[transparent]' : ''
            } table-header ${shouldHideHeader ? 'tab' : ''} `}
          >
            <TableRow className={` !bg-[#1c1c28] table-row-head`}>
              {headersJSX.map((idx, i) => {
                let show = true;
                // if (showOnly) show = showOnly.includes(idx);
                return (
                  <TableCell
                    width={widths && idx < widths.length ? widths[idx] : ''}
                    key={i}
                    align="center"
                    className={`!bg-[#1c1c28] !text-f12 ${
                      show ? '' : '!hidden'
                    }  ${smThHeight ? 'th-head ' : ''}  ${
                      noHover ? 'no-hover' : 'transparent-hover'
                    }  ${isHeaderTransparent ? '!bg-[transparent]' : ''} !z-10`}
                  >
                    {idx}
                  </TableCell>
                );
              })}
              {accordianJSX && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody className={'table-body ' + tableBodyClass}>
            {topDecorator}
            {loading ? (
              <TableRow
                className={`table-row skel ${rowClass}  ${
                  noHover ? 'no-hover' : 'transparent-hover'
                } ${isBodyTransparent ? 'transparent' : ''}`}
              >
                <TableCell className="skel-cell" colSpan={100}>
                  <Skeleton className="skel" />
                </TableCell>
              </TableRow>
            ) : shouldHideBody ? (
              <></>
            ) : rows ? (
              createArray(rows).map((crow) => {
                let rowIdx = crow;
                if (crow == customIdx) {
                  return (
                    <TableRow
                      className={`group table-row  ${rowClass} ${
                        noHover ? 'no-hover' : 'transparent-hover'
                      } ${isBodyTransparent ? 'transparent' : ''}`}
                    >
                      <TableCell className="!p-[0px] !border-none" colSpan={7}>
                        {customRow}
                      </TableCell>
                    </TableRow>
                  );
                }
                // if (crow > customIdx) {
                //   rowIdx--;
                // }
                const borderR = '!rounded-tr-[5px] !rounded-br-[5px]';
                const borderL = '!rounded-tl-[5px] !rounded-bl-[5px]';

                // []
                // 0 border top left, bottom left: radius 5px & bg =  blue
                // 3 border top-right, bottom-right: radius 5px & bg =  blue

                //    []
                // 3 border top-left, bottom-left: radius 5px & bg =  red
                // 6 border top right, bottom right: radius 5px & bg =  red
                return (
                  <>
                    {/* Data Row */}
                    <TableRow
                      key={rowIdx}
                      className={`group table-row  !mt-[0px]  ${rowClass} ${
                        noHover ? 'no-hover' : 'transparent-hover'
                      } ${isBodyTransparent ? 'transparent' : ''}`}
                      onClick={() => {
                        onRowClick(rowIdx);
                        if (!!accordianJSX) {
                          toggleRowExpansion(rowIdx);
                        }
                      }}
                    >
                      {createArray(cols).map((col, colIdx) => {
                        function getClassNames() {
                          let className = '';

                          if (!isValueAvailable(isAboveSelected))
                            if (colIdx == 3) {
                              className += '  bg-[#282B39] ';
                              if (crow == 0) {
                                className += ' !rounded-t-[8px] ';
                              }
                              if (crow == rows - 1) {
                                className += ' !rounded-b-[8px] ';
                              }
                              if (crow + 1 == customIdx) {
                                className += ' !rounded-b-[8px]';
                              }
                              if (crow - 1 == customIdx) {
                                className += ' !rounded-t-[8px]';
                              }
                              return className;
                            }

                          //

                          if (crow != selectedRow) return '';
                          if (colIdx == 0) {
                            if (isAboveSelected) className += borderL;
                          }
                          if (colIdx == 3) {
                            if (isAboveSelected) className += borderR;
                            else className += borderL;
                          }
                          if (colIdx == 6) {
                            if (!isAboveSelected) className += borderR;
                          }

                          if (isAboveSelected) {
                            if (colIdx <= 3) {
                              className += ' !bg-[#3772FF66] !text-[white]';
                            }
                          } else {
                            if (colIdx >= 3) {
                              className += ' !bg-[#ff686866] !text-[white]';
                            }
                          }
                          return className;
                        }
                        return (
                          <TableCell
                            key={rowIdx.toString() + colIdx}
                            className={
                              getClassNames() +
                              ' ' +
                              tableCellCls +
                              ` ${
                                showOnly
                                  ? showOnly.includes(colIdx)
                                    ? ''
                                    : '!hidden'
                                  : ''
                              }`
                            }
                            align="center"
                            width={
                              widths && colIdx < widths.length
                                ? widths[colIdx]
                                : ''
                            }
                          >
                            {bodyJSX(rowIdx, col)}
                          </TableCell>
                        );
                      })}

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
export { BufferTableCell, BufferTableRow, BufferTableCopy };

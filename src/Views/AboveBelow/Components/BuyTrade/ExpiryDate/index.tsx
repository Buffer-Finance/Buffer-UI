import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { selectedExpiry } from '@Views/AboveBelow/atoms';
import BufferTable from '@Views/Common/BufferTable';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import styled from '@emotion/styled';
import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { CLockSVG } from './ClockSVG';
import { formatTimestampToHHMM, generateTimestamps } from './helpers';

export const ExpiryDate: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [selectedTimestamp, setSelectedTimestamp] = useAtom(selectedExpiry);
  const [counter, setCounter] = useState(0);
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);
  const {
    oneMinuteTimestamps: oneMinuteArray,
    currentTimeStamp,
    fifteenMinuteTimestamps,
  } = generateTimestamps();
  function closeDropdown() {
    toggleMenu(false);
  }

  useEffect(() => {
    if (selectedTimestamp === undefined) {
      setSelectedTimestamp(oneMinuteArray[0]);
    } else {
      if (selectedTimestamp < oneMinuteArray[0]) {
        setSelectedTimestamp(oneMinuteArray[0]);
      }
    }
    const timer = setInterval(() => {
      setCounter(counter + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <ColumnGap gap="4px">
      <div className="text-[#7F87A7] text-f12 font-normal">Select Expiry</div>
      <>
        <TimeSelectorBackground
          type="button"
          ref={ref}
          {...anchorProps}
          test-id="time-selector-button-click"
        >
          <button
            className="plusMinusButton"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (selectedTimestamp === undefined) return;
              if (selectedTimestamp === oneMinuteArray[0]) return;
              const index = oneMinuteArray.indexOf(selectedTimestamp);
              if (index === -1) {
                const fifteenMinuteIndex =
                  fifteenMinuteTimestamps.indexOf(selectedTimestamp);
                if (fifteenMinuteIndex === -1) return;
                if (fifteenMinuteIndex === 0) {
                  setSelectedTimestamp(oneMinuteArray[0]);
                } else {
                  setSelectedTimestamp(
                    fifteenMinuteTimestamps[fifteenMinuteIndex - 1]
                  );
                }
              } else {
                setSelectedTimestamp(oneMinuteArray[index - 1]);
              }
            }}
          >
            -
          </button>
          <div className="flex gap-1 items-center">
            <CLockSVG color="#fff" className="mt-1" />
            {selectedTimestamp !== undefined
              ? formatTimestampToHHMM(selectedTimestamp)
              : '00:00'}
          </div>
          <button
            className="plusMinusButton"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (selectedTimestamp === undefined) return;
              const fifteenMinuteIndex =
                fifteenMinuteTimestamps.indexOf(selectedTimestamp);
              if (fifteenMinuteIndex === fifteenMinuteTimestamps.length - 1)
                return;
              if (fifteenMinuteIndex === -1) {
                const index = oneMinuteArray.indexOf(selectedTimestamp);
                if (index === oneMinuteArray.length - 1) {
                  setSelectedTimestamp(fifteenMinuteTimestamps[0]);
                } else setSelectedTimestamp(oneMinuteArray[index + 1]);
              } else {
                setSelectedTimestamp(
                  fifteenMinuteTimestamps[fifteenMinuteIndex + 1]
                );
              }
            }}
          >
            +
          </button>
        </TimeSelectorBackground>
        <ControlledMenu
          {...menuState}
          anchorRef={ref}
          onClose={closeDropdown}
          viewScroll="initial"
          direction="bottom"
          position="anchor"
          align="end"
          portal
          menuClassName={'!p-[0] !rounded-[10px] hover:!rounded-[10px]'}
          offsetY={10}
        >
          <MenuItem
            className={({ hover }) => {
              return `!p-[0] ${hover ? '!rounded-[10px]' : ''}`;
            }}
            onClick={(e: ClickEvent) => {
              e.keepOpen = true;
            }}
          >
            <SelectorDropdownWrapper>
              <BufferTable
                bodyJSX={(row, col) => {
                  const timestamp = oneMinuteArray[row];
                  const isSelected = timestamp === selectedTimestamp;
                  switch (col) {
                    case 0:
                      return (
                        <div className={`ml-6 ${isSelected ? 'text-1' : ''}`}>
                          {formatTimestampToHHMM(timestamp)}
                        </div>
                      );
                    case 1:
                      const distance = timestamp - currentTimeStamp;

                      return (
                        <div
                          className={`flex items-center gap-2 ${
                            isSelected ? 'text-1' : ''
                          }`}
                        >
                          <CLockSVG
                            className={
                              isSelected ? 'hidden' : 'group-hover:hidden'
                            }
                          />
                          <CLockSVG
                            className={
                              isSelected ? 'block' : 'group-hover:block hidden'
                            }
                            color="#fff"
                          />
                          {formatDistance(Variables(distance / 1000))}
                        </div>
                      );
                    default:
                      return <div>?</div>;
                  }
                }}
                cols={2}
                headerJSX={(col) => {
                  return col === 0 ? (
                    <div className="ml-3">Time</div>
                  ) : (
                    <div>Remaining</div>
                  );
                }}
                onRowClick={(row) => {
                  setSelectedTimestamp(oneMinuteArray[row]);
                  closeDropdown();
                }}
                rows={oneMinuteArray.length}
                isBodyTransparent
                headClassName="headClassName"
                headCellClassName="leftHeadCellClassName"
                className="!rounded-l-lg !rounded-r-none"
                cellClassName="cellClassName"
                rowClassName="rowClassName"
                highlightIndexs={[
                  oneMinuteArray.indexOf(selectedTimestamp ?? 0),
                ]}
                highlightClass="highlightRowClassName"
              />
              <BufferTable
                bodyJSX={(row, col) => {
                  const timestamp = fifteenMinuteTimestamps[row];
                  const isSelected = timestamp === selectedTimestamp;
                  switch (col) {
                    case 0:
                      return (
                        <div className={`ml-7 ${isSelected ? 'text-1' : ''}`}>
                          {formatTimestampToHHMM(timestamp)}
                        </div>
                      );
                    case 1:
                      const distance = timestamp - currentTimeStamp;

                      return (
                        <div
                          className={`flex items-center gap-2 ${
                            isSelected ? 'text-1' : ''
                          }`}
                        >
                          <CLockSVG
                            className={
                              isSelected ? 'hidden' : 'group-hover:hidden'
                            }
                          />
                          <CLockSVG
                            className={
                              isSelected ? 'block' : 'group-hover:block hidden'
                            }
                            color="#fff"
                          />
                          {formatDistance(Variables(distance / 1000))}
                        </div>
                      );
                    default:
                      return <div>?</div>;
                  }
                }}
                cols={2}
                headerJSX={(col) => {
                  return col === 0 ? (
                    <div className="ml-7">Time</div>
                  ) : (
                    <div>Remaining</div>
                  );
                }}
                onRowClick={(row) => {
                  setSelectedTimestamp(fifteenMinuteTimestamps[row]);
                  closeDropdown();
                }}
                rows={fifteenMinuteTimestamps.length}
                isBodyTransparent
                headClassName="headClassName"
                headCellClassName="rightHeadCellClassName"
                className="!rounded-r-lg !rounded-l-none "
                cellClassName="cellClassName"
                rowClassName="rowClassName"
                highlightIndexs={[
                  fifteenMinuteTimestamps.indexOf(selectedTimestamp ?? 0),
                ]}
                highlightClass="highlightRowClassName"
              />
            </SelectorDropdownWrapper>
          </MenuItem>
        </ControlledMenu>
      </>
    </ColumnGap>
  );
};

const TimeSelectorBackground = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #282b39;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;

  .plusMinusButton {
    padding: 4px;
    border-radius: 9999px;
    background-color: #191b20;
    color: #c3c2d4;
    font-size: 16px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 5px;
  }
`;

const SelectorDropdownWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 16px;
  background-color: #141823;
  width: 400px;
  max-height: 70vh;
  color: #fff;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 2px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 24px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 24px;
  }

  .headClassName {
    background-color: #282b39;
  }
  .rightHeadCellClassName {
    background-color: #282b39;
    padding: 12px 0px;
    font-size: 13px;
    font-weight: 400;
    color: #7f87a7;
    border: none;
    border-radius: 0px;

    &:last-of-type {
      border-radius: 0 8px 8px 0;
    }
    /* &:last-of-type {
      border-radius: 0 8px 8px 0;
    } */
  }

  .leftHeadCellClassName {
    background-color: #282b39;
    padding: 12px 0px;
    font-size: 13px;
    font-weight: 400;
    color: #7f87a7;
    border: none;
    border-radius: 0px;
    &:first-of-type {
      padding: 12px 0px 12px 16px;
    }
    &:first-of-type {
      border-radius: 8px 0 0 8px;
    }
  }

  .rowClassName {
    color: #7f87a7;

    :hover {
      color: #fff;
      background-color: #282b39 !important;
    }
  }

  .highlightRowClassName {
    color: #fff;
    background-color: #282b39 !important;
  }
  .cellClassName {
    color: inherit;
    font-size: 14px;
    padding: 6px 0;
    border: none;

    :first-of-type {
      border-radius: 4px 0 0 4px;
    }
    :last-of-type {
      border-radius: 0 4px 4px 0;
    }

    :hover {
      color: #fff;
    }
  }
`;

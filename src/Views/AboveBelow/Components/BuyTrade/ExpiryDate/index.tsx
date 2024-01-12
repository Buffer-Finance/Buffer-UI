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
          <button className="plusMinusButton">-</button>
          <div className="flex gap-1 items-center">
            <CLockSVG color="#fff" className="mt-1" />
            {selectedTimestamp !== undefined
              ? formatTimestampToHHMM(selectedTimestamp)
              : '00:00'}
          </div>
          <button className="plusMinusButton">+</button>
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
                  switch (col) {
                    case 0:
                      return <div>{formatTimestampToHHMM(timestamp)}</div>;
                    case 1:
                      const distance = timestamp - currentTimeStamp;

                      return (
                        <div className="flex items-center gap-1">
                          <CLockSVG color="#fff" className="mt-1" />
                          {formatDistance(Variables(distance / 1000))}
                        </div>
                      );
                    default:
                      return <div>?</div>;
                  }
                }}
                cols={2}
                headerJSX={(col) => {
                  return col === 0 ? <div>Time</div> : <div>Remaining</div>;
                }}
                onRowClick={(row) => {
                  setSelectedTimestamp(oneMinuteArray[row]);
                  closeDropdown();
                }}
                rows={15}
                isBodyTransparent
                headClassName="headClassName"
                headCellClassName="leftHeadCellClassName"
                className="!rounded-l-lg !rounded-r-none"
              />
              <BufferTable
                bodyJSX={(row, col) => {
                  const timestamp = fifteenMinuteTimestamps[row];
                  switch (col) {
                    case 0:
                      return <div>{formatTimestampToHHMM(timestamp)}</div>;
                    case 1:
                      const distance = timestamp - currentTimeStamp;

                      return (
                        <div className="flex items-center gap-1">
                          <CLockSVG color="#fff" className="mt-1" />
                          {formatDistance(Variables(distance / 1000))}
                        </div>
                      );
                    default:
                      return <div>?</div>;
                  }
                }}
                cols={2}
                headerJSX={(col) => {
                  return col === 0 ? <div>Time</div> : <div>Remaining</div>;
                }}
                onRowClick={(row) => {
                  setSelectedTimestamp(fifteenMinuteTimestamps[row]);
                  closeDropdown();
                }}
                rows={16}
                isBodyTransparent
                headClassName="headClassName"
                headCellClassName="rightHeadCellClassName"
                className="!rounded-r-lg !rounded-l-none"
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
  width: 350px;
  max-height: 80vh;
  color: #fff;

  .headClassName {
    background-color: #282b39;
  }
  .rightHeadCellClassName {
    background-color: #282b39;
    padding: 12px 0px;
    font-size: 12px;
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
    font-size: 12px;
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
`;

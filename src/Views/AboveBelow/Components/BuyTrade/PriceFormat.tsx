import { selectedPoolActiveMarketAtom } from '@Views/AboveBelow/atoms';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';

export const priceFormatAtom = atom<'Asset' | 'ROI'>('Asset');

export const PriceFormat = () => {
  const [priceFormat, setPriceFormat] = useAtom(priceFormatAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPriceFormat(event.target.value as 'Asset' | 'ROI');
  }
  if (!activeMarket)
    return <Skeleton variant="rectangular" width="100%" height="10px" />;
  return (
    <RowBetween className="text-[#7F87A7] text-f12 font-normal mt-[10px] mb-[6px]">
      Show Price As Per
      <RowGap gap="12px">
        {['Asset', 'ROI'].map((asset, index) => {
          const isActive = priceFormat === asset;
          return (
            <RowGap gap="4px">
              <RadioInput
                type="radio"
                id="poolRadio"
                name="age"
                value={asset}
                checked={isActive}
                onChange={handleChange}
              />
              <label htmlFor="poolRadio" className={`text-f12 'text-1' `}>
                {index === 0
                  ? activeMarket.poolInfo.token.toUpperCase()
                  : asset}
              </label>
            </RowGap>
          );
        })}
      </RowGap>
    </RowBetween>
  );
};

const RadioInput = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border: 1px solid ${(props) => (props.checked ? '#a3e3ff' : 'white')};
  border-radius: 50%;
  padding: 0;
  position: relative;

  /* Unchecked state styles */
  background: transparent;

  :hover {
    cursor: pointer;
  }

  /* Checked state styles */
  &:checked {
    background-color: transparent; /* Example color */
  }

  &:after {
    content: ''; /* Required for the pseudo-element */
    display: ${(props) =>
      props.checked ? 'block' : 'none'}; /* Show after for checked state */
    width: 8px; /* Adjust size */
    height: 8px; /* Adjust size */
    background-color: #a3e3ff; /* Color of the inner circle */
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
`;

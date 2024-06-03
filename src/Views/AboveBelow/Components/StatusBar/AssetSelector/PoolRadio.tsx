import {
  aboveBelowMarketsAtom,
  selectedPoolAtom,
} from '@Views/AboveBelow/atoms';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import { RadioTextHead } from '@Views/ABTradePage/Components/TextWrapper';
import { poolInfoType } from '@Views/ABTradePage/type';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';

export const PoolRadio: React.FC = () => {
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const tradingAssets = useMemo(() => {
    if (!markets) return [];
    const assetsSet = new Set<poolInfoType>();
    markets.forEach((market) => {
      assetsSet.add(market.poolInfo);
    });
    return Array.from(assetsSet);
  }, [markets]);

  const [selectedPool, setSelectedPool] = useAtom(selectedPoolAtom);
  function handleChange(pool: poolInfoType) {
    setSelectedPool(pool);
  }

  useEffect(() => {
    if (tradingAssets.length > 0 && selectedPool === null) {
      setSelectedPool(tradingAssets[1]);
    }
  }, []);

  return (
    <RowGap gap="8px" className="ml-auto">
      <RadioTextHead>
        <Trans>Trading Asset</Trans>
      </RadioTextHead>

      {tradingAssets?.map((pool, index) => {
        const isActive = selectedPool === pool;
        return (
          pool.token !== 'USDC' && (
            <RowGap gap="4px" key={pool.token}>
              <RadioInput
                type="radio"
                id="poolRadio"
                name="age"
                value={pool.token}
                checked={isActive}
                onChange={() => handleChange(pool)}
              />
              <label
                htmlFor="poolRadio"
                className={`text-f12 ${isActive ? 'text-1' : 'text-2'}`}
              >
                {' '}
                {pool.token}
              </label>
            </RowGap>
          )
        );
      })}
    </RowGap>
  );
};

const RadioInput = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border: 1px solid #c3c2d4;
  border-radius: 50%;
  padding: 0;
  position: relative;

  /* Unchecked state styles */
  background: transparent;

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
    background-color: #3772ff; /* Color of the inner circle */
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
`;

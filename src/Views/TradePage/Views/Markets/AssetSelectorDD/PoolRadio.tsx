import { RowGap } from '@Views/TradePage/Components/Row';
import { RadioTextHead } from '@Views/TradePage/Components/TextWrapper';
import { useActivePoolObject } from '@Views/TradePage/Hooks/useActivePoolObject';
import { radioValueAtom } from '@Views/TradePage/atoms';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';

export const PoolRadio: React.FC = () => {
  const { poolNameList: tradingAssets } = useActivePoolObject();
  const [selectedAsset, setSelectedAsset] = useAtom(radioValueAtom);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedAsset(event.target.value);
  }

  return (
    <RowGap gap="8px" className="ml-auto">
      <RadioTextHead>
        <Trans>Trading Asset</Trans>
      </RadioTextHead>

      {tradingAssets?.map((asset, index) => {
        const isActive = selectedAsset === asset;
        return (
          <RowGap gap="4px" key={asset}>
            <RadioInput
              type="radio"
              id="poolRadio"
              name="age"
              value={asset}
              checked={isActive}
              onChange={handleChange}
            />
            <label
              htmlFor="poolRadio"
              className={`text-f12 ${isActive ? 'text-1' : 'text-2'}`}
            >
              {' '}
              {asset}
            </label>
          </RowGap>
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

import { IconToolTip } from '@Views/ABTradePage/Components/IconToolTip';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import { SettingsText } from '@Views/ABTradePage/Components/TextWrapper';
import { Trans } from '@lingui/macro';
import { SlippageError } from './SlippageError';
import { SlippageInput } from './SlippageInput';
import { SlippageSelector } from './SlippageSelector';

export const Slippage: React.FC<{
  setSlippage: (newSlippage: number) => void;
  currentSlippage: number;
}> = ({ setSlippage, currentSlippage }) => {
  return (
    <div>
      <RowGap gap="4px">
        <SettingsText>
          <Trans>Slippage tolerance</Trans>
        </SettingsText>
        <IconToolTip
          content={
            <Trans>
              Slippage tolerance is the %age of price fluctuation you can
              tolerate before your trade is opened
            </Trans>
          }
        />
      </RowGap>
      <RowGap gap="8px" className="mt-3">
        <SlippageSelector
          currentSlippage={currentSlippage}
          onClick={setSlippage}
        />
        <SlippageInput onChange={setSlippage} slippage={currentSlippage} />
      </RowGap>
      <SlippageError slippage={currentSlippage} />
    </div>
  );
};

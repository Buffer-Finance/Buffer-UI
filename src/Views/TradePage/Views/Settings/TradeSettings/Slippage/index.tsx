import { IconToolTip } from '@Views/TradePage/Components/IconToolTip';
import { RowGap } from '@Views/TradePage/Components/Row';
import { SettingsText } from '@Views/TradePage/Components/TextWrapper';
import { SlippageSelector } from './SlippageSelector';
import { SlippageInput } from './SlippageInput';
import { Trans } from '@lingui/macro';

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
    </div>
  );
};

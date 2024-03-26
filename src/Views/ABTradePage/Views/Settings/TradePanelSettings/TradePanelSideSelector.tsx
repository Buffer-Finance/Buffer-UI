import { RowGap } from '@Views/ABTradePage/Components/Row';
import { tradePanelPosition } from '@Views/ABTradePage/type';
import { LeftTradePanelSideSelector } from './LeftTradePanelSideSelector';
import { RightTradePanelSideSelector } from './RightTradePanelSideSelector';

export const TradePanelSideSelector: React.FC<{
  onClick: (newPosition: number) => void;
  selectedPosition: number;
}> = ({ onClick, selectedPosition }) => {
  return (
    <RowGap gap="4px" className="justify-center">
      <LeftTradePanelSideSelector
        isSelected={tradePanelPosition.Left === selectedPosition}
        onClick={() => {
          onClick(tradePanelPosition.Left);
        }}
      />
      <RightTradePanelSideSelector
        isSelected={tradePanelPosition.Right === selectedPosition}
        onClick={() => {
          onClick(tradePanelPosition.Right);
        }}
      />
    </RowGap>
  );
};

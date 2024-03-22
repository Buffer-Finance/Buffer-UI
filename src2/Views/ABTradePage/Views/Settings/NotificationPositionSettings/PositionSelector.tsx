import styled from '@emotion/styled';
import { TopLeftPositionSelector } from './TopLeftPositionSelector';
import { TopRightPositionSelecotr } from './TopRightPositionSelector';
import { BottomLeftPositionSelector } from './BottomLeftPositionSelector';
import { BottomRightPositionSelector } from './BottomRightPositionSelector';
import { notificationPosition } from '@Views/TradePage/type';

const GridTwoByTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px 4px;
`;

export const PositionSelector: React.FC<{
  onClick: (newPosition: number) => void;
  selectedPosition: number;
}> = ({ onClick, selectedPosition }) => {
  function handlePositionClick(position: number) {
    onClick(position);
  }

  return (
    <GridTwoByTwo className="w-fit m-auto">
      <TopLeftPositionSelector
        isSelected={notificationPosition.TopLeft === selectedPosition}
        onClick={() => handlePositionClick(notificationPosition.TopLeft)}
      />
      <TopRightPositionSelecotr
        isSelected={notificationPosition.TopRight === selectedPosition}
        onClick={() => handlePositionClick(notificationPosition.TopRight)}
      />
      <BottomLeftPositionSelector
        isSelected={notificationPosition.BottomLeft === selectedPosition}
        onClick={() => handlePositionClick(notificationPosition.BottomLeft)}
      />
      <BottomRightPositionSelector
        isSelected={notificationPosition.BottomRight === selectedPosition}
        onClick={() => handlePositionClick(notificationPosition.BottomRight)}
      />
    </GridTwoByTwo>
  );
};

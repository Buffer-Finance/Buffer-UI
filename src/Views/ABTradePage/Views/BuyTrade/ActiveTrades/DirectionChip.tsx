import LockIcon from '@SVG/Elements/LockIcon';
import { DownArrowSVG } from '@Views/ABTradePage/Components/DownArrowSVG';
import { UpArrowSVG } from '@Views/ABTradePage/Components/UpArrowSVG';
import styled from '@emotion/styled';

const DirectionChipBackground = styled.div<{ isUp: boolean }>`
  background-color: #232334;
  border-radius: 4px;
  padding: 2px 4px;

  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  gap: 2px;

  .text {
    font-size: 10px;
    font-weight: 400;
    color: ${(props) => (props.isUp ? '#3FB68B' : '#FF5353')};
  }
`;

export const DirectionChip: React.FC<{
  isUp: boolean | undefined;
  shouldShowArrow: boolean;
  className?: string;
  upText?: string;
  downText?: string;
}> = ({
  isUp,
  shouldShowArrow,
  className = '',
  downText = 'Down',
  upText = 'Up',
}) => {
  if (isUp === undefined) return <LockIcon />;
  return (
    <DirectionChipBackground isUp={isUp} className={className}>
      {shouldShowArrow &&
        (isUp ? <UpArrowSVG /> : <DownArrowSVG className="mt-[1px]" />)}
      <span className="text">{isUp ? upText : downText}</span>
    </DirectionChipBackground>
  );
};

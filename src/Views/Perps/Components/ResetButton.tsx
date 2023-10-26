import { ResetSVG } from './ResetSVG';
import NumberTooltip from '@Views/Common/Tooltips';

export const ResetButton: React.FC<{
  className?: string;
  onClick: () => void;
}> = ({ className = '', onClick }) => {
  return (
    <NumberTooltip content={'Reset'}>
      <div className={className + ' !w-fit group'} role="div" onClick={onClick}>
        <ResetSVG />
      </div>
    </NumberTooltip>
  );
};

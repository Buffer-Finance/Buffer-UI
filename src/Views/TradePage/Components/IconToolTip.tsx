import NumberTooltip from '@Views/Common/Tooltips';
import { ToolTipSVG } from './ToolTipSVG';

export const IconToolTip: React.FC<{ content: string }> = ({ content }) => {
  return (
    <NumberTooltip content={content}>
      <div>
        <ToolTipSVG />
      </div>
    </NumberTooltip>
  );
};

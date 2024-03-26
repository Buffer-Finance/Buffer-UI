import NumberTooltip from '@Views/Common/Tooltips';
import { ToolTipSVG } from './ToolTipSVG';
import { LightToolTipSVG } from './LightToolTipSVG';

export const IconToolTip: React.FC<{ content: JSX.Element }> = ({
  content,
}) => {
  return (
    <NumberTooltip content={content}>
      <div>
        <ToolTipSVG />
      </div>
    </NumberTooltip>
  );
};

export const LightIconToolTip: React.FC<{ content: JSX.Element }> = ({
  content,
}) => {
  return (
    <NumberTooltip content={content}>
      <div>
        <LightToolTipSVG />
      </div>
    </NumberTooltip>
  );
};

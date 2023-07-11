import { Tooltip } from '@mui/material';

interface Itooltip {
  content: any;
  className?: string;
  children?: any;
  followCursor?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}
const NumberTooltip: React.FC<Itooltip> = ({
  content,
  children,
  className,
  followCursor,
  placement,
}) => {
  const tooltipStyles = {
    tooltip: 'tooltip ' + className,
    arrow: 'arrow',
  };

  return (
    <Tooltip
      title={content}
      id="tooltip"
      placement={placement || 'top'}
      arrow
      followCursor={!followCursor ? false : true}
      classes={tooltipStyles}
      enterTouchDelay={0}
      // open
      leaveTouchDelay={10000}

      // disableHoverListener={window.innerWidth < 600}
    >
      {children}
    </Tooltip>
  );
};

export default NumberTooltip;

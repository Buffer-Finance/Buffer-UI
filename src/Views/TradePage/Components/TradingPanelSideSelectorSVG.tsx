import { SVGProps } from 'react';
import { tradePanelPosition } from '../type';

export const TradingPanelSideSelectorSVG: React.FC<{
  svgProps?: SVGProps<SVGSVGElement>;
  selectedSide: number;
}> = ({ svgProps, selectedSide }) => {
  return (
    <svg
      width="191"
      height="40"
      viewBox="0 0 191 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <rect width="91.7031" height="39.5417" rx="5" fill="#2C2C41" />
      <rect
        x="98.4341"
        width="91.7031"
        height="39.5417"
        rx="5"
        fill="#2C2C41"
      />
      <rect
        x="7.57227"
        y="5.88916"
        width="12.6197"
        height="26.922"
        rx="5"
        fill={selectedSide === tradePanelPosition.Left ? '#3772FF' : '#4F505E'}
      />
      <rect
        x="169.946"
        y="5.88916"
        width="12.6197"
        height="26.922"
        rx="5"
        fill={selectedSide === tradePanelPosition.Right ? '#3772FF' : '#4F505E'}
      />
    </svg>
  );
};

import { SVGProps } from 'react';

export const RightTradePanelSideSelector: React.FC<{
  svgProps?: SVGProps<SVGSVGElement>;
  onClick: () => void;
  isSelected: boolean;
}> = ({ svgProps, onClick, isSelected }) => {
  return (
    <svg
      width="93"
      height="40"
      viewBox="0 0 93 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      role="button"
      {...svgProps}
    >
      <rect
        x="0.434082"
        width="91.7031"
        height="39.5417"
        rx="5"
        fill="#2C2C41"
      />
      <rect
        x="71.9458"
        y="5.88916"
        width="12.6197"
        height="26.922"
        rx="5"
        fill={isSelected ? '#3772FF' : '#4F505E'}
      />
    </svg>
  );
};

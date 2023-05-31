import { SVGProps } from 'react';

export const BottomLeftPositionSelector: React.FC<{
  svgProps?: SVGProps<SVGSVGElement>;
  onClick: () => void;
  isSelected: boolean;
}> = ({ svgProps, onClick, isSelected }) => {
  return (
    <svg
      width="92"
      height="41"
      viewBox="0 0 92 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...svgProps}
      role="button"
    >
      <rect
        y="0.589844"
        width="91.7031"
        height="39.5417"
        rx="5"
        fill="#2C2C41"
      />
      <rect
        x="6.73047"
        y="31.7183"
        width="12.6197"
        height="26.922"
        rx="5"
        transform="rotate(-90 6.73047 31.7183)"
        fill={isSelected ? '#3772FF' : '#4F505E'}
      />
    </svg>
  );
};

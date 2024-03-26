import { SVGProps } from 'react';

export const TopRightPositionSelecotr: React.FC<{
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
      {...svgProps}
      role="button"
    >
      <rect
        x="0.433594"
        width="91.7031"
        height="39.5417"
        rx="5"
        fill="#2C2C41"
      />
      <rect
        x="55.1191"
        y="20.1914"
        width="12.6197"
        height="26.922"
        rx="5"
        transform="rotate(-90 55.1191 20.1914)"
        fill={isSelected ? '#3772FF' : '#4F505E'}
      />
    </svg>
  );
};

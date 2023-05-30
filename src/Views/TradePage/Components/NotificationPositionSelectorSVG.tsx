import { SVGProps } from 'react';
import { notificationPosition } from '../type';

export const NotificationPositionSelectorSVG: React.FC<{
  svgProps?: SVGProps<SVGSVGElement>;
  selectedPosition: number;
}> = ({ selectedPosition, svgProps }) => {
  return (
    <svg
      width="191"
      height="85"
      viewBox="0 0 191 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <rect width="91.7031" height="39.5417" rx="5" fill="#2C2C41" />
      <rect
        y="44.5898"
        width="91.7031"
        height="39.5417"
        rx="5"
        fill="#2C2C41"
      />
      <rect
        x="98.4336"
        width="91.7031"
        height="39.5417"
        rx="5"
        fill="#2C2C41"
      />
      <rect
        x="98.4336"
        y="44.5898"
        width="91.7031"
        height="39.5417"
        rx="5"
        fill="#2C2C41"
      />
      <rect
        x="6.80225"
        y="19.5044"
        width="12.6197"
        height="26.922"
        rx="5"
        transform="rotate(-90 6.80225 19.5044)"
        fill={
          selectedPosition === notificationPosition.TopLeft
            ? '#3772FF'
            : '#4F505E'
        }
      />
      <rect
        x="6.73047"
        y="75.7183"
        width="12.6197"
        height="26.922"
        rx="5"
        transform="rotate(-90 6.73047 75.7183)"
        fill={
          selectedPosition === notificationPosition.BottomLeft
            ? '#3772FF'
            : '#4F505E'
        }
      />
      <rect
        x="153.119"
        y="20.1914"
        width="12.6197"
        height="26.922"
        rx="5"
        transform="rotate(-90 153.119 20.1914)"
        fill={
          selectedPosition === notificationPosition.TopRight
            ? '#3772FF'
            : '#4F505E'
        }
      />
      <rect
        x="154"
        y="76.6196"
        width="12.6197"
        height="26.922"
        rx="5"
        transform="rotate(-90 154 76.6196)"
        fill={
          selectedPosition === notificationPosition.BottomRight
            ? '#3772FF'
            : '#4F505E'
        }
      />
    </svg>
  );
};

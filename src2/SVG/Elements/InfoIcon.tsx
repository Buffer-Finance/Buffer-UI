import * as React from 'react';
import { ReactNode } from 'react';
import NumberTooltip from '@Views/Common/Tooltips';
interface IInfoIcon extends React.SVGProps<SVGSVGElement> {
  tooltip: ReactNode;
  className?: string;
  sm?: boolean;
}

const InfoIcon: React.FC<IInfoIcon> = (props) => {
  return (
    <NumberTooltip content={props.tooltip}>
      {props.sm ? (
        <svg
          width={13}
          height={13}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <circle cx={6.901} cy={6.36} r={6} fill="#808191" />
          <path
            d="M6.352 9.595V4.968h1.09v4.627h-1.09ZM6.9 4.311a.636.636 0 0 1-.446-.172.554.554 0 0 1-.186-.418c0-.165.062-.305.186-.42a.63.63 0 0 1 .446-.174c.175 0 .324.058.446.175a.547.547 0 0 1 .187.419.554.554 0 0 1-.187.418.63.63 0 0 1-.446.172Z"
            fill="var(--bg-4)"
          />
        </svg>
      ) : (
        <svg
          width={18}
          height={18}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <circle cx={8.929} cy={9.432} r={8.5} fill="#808191" />
          <path
            d="M8.15 14.016V7.46h1.545v6.556H8.15Zm.777-7.486a.901.901 0 0 1-.632-.244.784.784 0 0 1-.264-.593c0-.233.088-.43.264-.593a.893.893 0 0 1 .632-.248c.248 0 .458.083.632.248.176.162.264.36.264.593 0 .23-.088.428-.264.593a.892.892 0 0 1-.632.244Z"
            fill="var(--bg-4)"
          />
        </svg>
      )}
    </NumberTooltip>
  );
};

export const IIconsm = (props) => {
  return (
    <svg
      width={13}
      height={13}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={6.901} cy={6.36} r={6} fill="var(--bg20-primary)" />
      <path
        d="M6.352 9.595V4.968h1.09v4.627h-1.09ZM6.9 4.311a.636.636 0 0 1-.446-.172.554.554 0 0 1-.186-.418c0-.165.062-.305.186-.42a.63.63 0 0 1 .446-.174c.175 0 .324.058.446.175a.547.547 0 0 1 .187.419.554.554 0 0 1-.187.418.63.63 0 0 1-.446.172Z"
        fill="var(--bg-4)"
      />
    </svg>
  );
};

export const IIcon = (props) => {
  return (
    <svg
      width={18}
      height={18}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={8.929} cy={9.432} r={8.5} fill="var(--bg20-primary)" />
      <path
        d="M8.15 14.016V7.46h1.545v6.556H8.15Zm.777-7.486a.901.901 0 0 1-.632-.244.784.784 0 0 1-.264-.593c0-.233.088-.43.264-.593a.893.893 0 0 1 .632-.248c.248 0 .458.083.632.248.176.162.264.36.264.593 0 .23-.088.428-.264.593a.892.892 0 0 1-.632.244Z"
        fill="var(--bg-4)"
      />
    </svg>
  );
};

export default InfoIcon;

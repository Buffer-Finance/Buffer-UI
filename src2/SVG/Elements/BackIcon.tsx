import * as React from 'react';

function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={21} height={21} fill="none" {...props}>
      <rect
        width={20.923}
        height={20.508}
        rx={5.429}
        transform="matrix(1 0 0 -1 0 20.508)"
        fill="#282B39"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.05 11.046c-.238-.557-.082-.978.339-1.436 1.407-1.47 2.752-2.997 4.129-4.496a.95.95 0 011.24-.158.977.977 0 01.387 1.145 2.062 2.062 0 01-.303.455l-2.415 2.63-.225.245.356-.011c2.789-.09 5.518-.176 8.306-.265.416-.013.806.064 1.037.501.36.612.042 1.335-.636 1.446l-.356.011c-2.729.087-5.486.205-8.246.263l-.356.011.25.23 2.718 2.496c.187.172.319.405.39.64.157.708-.467 1.262-1.16 1.077l-.272-.08c-1.715-1.52-3.465-3.126-5.184-4.704z"
        fill="#808191"
        stroke="#7F87A7"
        strokeWidth={0.2}
      />
    </svg>
  );
}

const MemoBackIcon = React.memo(BackIcon);
export default MemoBackIcon;

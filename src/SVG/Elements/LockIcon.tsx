import * as React from 'react';
import { SVGProps } from 'react';
const LockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={20}
    fill="none"
    className="ml-2 sm:ml-[0px]"
    {...props}
  >
    <g filter="url(#a)">
      <path
        fill="#232334"
        d="M1 6a5 5 0 0 1 5-5h22a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5H6a5 5 0 0 1-5-5V6Z"
      />
    </g>

    <path
      fill="#fff"
      fillRule="evenodd"
      d="M16.972 4.048h.445c.026 0 .052.014.078.014.144.027.274.041.418.069.523.138.967.401 1.346.816.51.553.797 1.204.836 1.964.027.346.013.678.013 1.024v.11h.17c.13 0 .248.056.327.153.144.152.183.346.183.553v4.496c0 .332-.118.595-.431.706h-6.338a.603.603 0 0 1-.3-.222c-.105-.166-.131-.346-.131-.54V8.794c0-.07 0-.152.013-.222.052-.345.261-.54.588-.54h.091v-.11c0-.249-.013-.498 0-.747.014-.235.014-.484.079-.72.313-1.286 1.071-2.102 2.313-2.378.104 0 .209-.014.3-.028Zm1.921 4.012v-.913c-.013-.54-.196-.996-.575-1.356-.483-.457-1.058-.595-1.672-.36-.64.235-1.033.733-1.137 1.453-.053.373-.026.76-.026 1.148 0 0 0 .014.013.028h3.397Zm-2.274 3.665v.61c0 .234.105.345.327.345h.51c.222 0 .326-.11.326-.346V11.31c0-.166.014-.304.105-.456.196-.304.144-.692-.078-.982-.196-.25-.575-.346-.876-.235-.523.193-.706.857-.353 1.314a.302.302 0 0 1 .053.138c-.014.208-.014.415-.014.636Z"
      clipRule="evenodd"
    />
    <defs>
      <filter
        id="a"
        width={34}
        height={18}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_200_9126"
          stdDeviation={0.5}
        />
      </filter>
      <filter
        id="c"
        width={12.657}
        height={10.095}
        x={3}
        y={3.571}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_200_9126"
          stdDeviation={1}
        />
      </filter>
      <filter
        id="d"
        width={10.132}
        height={32.776}
        x={15.762}
        y={4.362}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_200_9126"
          stdDeviation={1}
        />
      </filter>
      <clipPath id="b">
        <path fill="#fff" d="M5 5.571h8.657v6.095H5z" />
      </clipPath>
    </defs>
  </svg>
);
export default LockIcon;

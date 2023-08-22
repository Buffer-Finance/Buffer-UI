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
    <g clipPath="url(#b)" filter="url(#c)">
      <path
        fill="#3FB68B"
        fillOpacity={0.12}
        d="M9.797 6.196a.441.441 0 0 0-.643 0l-3.618 4.485a.352.352 0 0 0-.038.391.406.406 0 0 0 .36.207h7.235c.074 0 .147-.019.21-.055a.388.388 0 0 0 .15-.151.352.352 0 0 0-.038-.392L9.797 6.196Z"
      />
    </g>
    <g filter="url(#d)">
      <path
        fill="#3FB68B"
        fillOpacity={0.12}
        d="M20.87 14.882c-.577 0-1.097-.12-1.56-.36a2.659 2.659 0 0 1-1.08-1.044c-.257-.456-.385-.996-.385-1.62V6.482c0-.08.04-.12.12-.12h.768c.08 0 .12.04.12.12v5.244c0 .712.172 1.256.516 1.632.352.376.852.564 1.5.564s1.144-.188 1.488-.564c.352-.376.528-.92.528-1.632V6.482c0-.08.04-.12.12-.12h.768c.08 0 .12.04.12.12v5.376c0 .624-.132 1.164-.396 1.62a2.564 2.564 0 0 1-1.08 1.044c-.456.24-.972.36-1.548.36ZM17.88 35.138c-.08 0-.12-.04-.12-.12v-8.16c0-.08.04-.12.12-.12h.696c.08 0 .12.04.12.12v.564c.224-.24.508-.432.852-.576a2.785 2.785 0 0 1 1.116-.228c.528 0 .992.132 1.392.396.408.264.724.632.948 1.104.224.472.336 1.016.336 1.632 0 .616-.112 1.16-.336 1.632-.224.472-.54.84-.948 1.104-.4.264-.864.396-1.392.396-.392 0-.756-.072-1.092-.216a3.157 3.157 0 0 1-.876-.6v2.952c0 .08-.04.12-.12.12h-.696Zm2.628-3.144c.592 0 1.048-.204 1.368-.612.32-.408.48-.952.48-1.632 0-.68-.16-1.224-.48-1.632-.32-.408-.776-.612-1.368-.612-.584 0-1.048.208-1.392.624-.344.416-.516.956-.516 1.62 0 .664.172 1.204.516 1.62.344.416.808.624 1.392.624Z"
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

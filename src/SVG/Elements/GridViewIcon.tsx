import * as React from "react";

const GridViewIcon = (props) => (
  <svg
    width={36}
    height={36}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#a)" fill={props.active ? "var(--bg-20)" : "var(--bg-14)"}>
      <path d="M4 5a5 5 0 0 1 5-5h8v13H4V5ZM19 0h8a5 5 0 0 1 5 5v8H19V0ZM4 15h13v13H9a5 5 0 0 1-5-5v-8ZM19 15h13v8a5 5 0 0 1-5 5h-8V15Z" />
    </g>
    <defs>
      <filter
        id="a"
        x={0}
        y={0}
        width={36}
        height={36}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_913_26785"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_913_26785"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default GridViewIcon;

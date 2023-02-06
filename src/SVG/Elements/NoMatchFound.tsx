import * as React from "react";

const NoMatchFound = (props) => (
  <svg
    width={42}
    height={30}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width={42} height={6} rx={3} fill="#2a2a3a" />
    <rect y={12} width={42} height={6} rx={3} fill="#2a2a3a" />
    <rect y={24} width={42} height={6} rx={3} fill="#2a2a3a" />
  </svg>
);

export default NoMatchFound;

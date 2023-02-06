import * as React from "react";

const UpTriangle = (props) => (
  <svg
    width={16}
    height={12}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.867 1.23a.773.773 0 0 0-1.189 0L.992 10.06a.73.73 0 0 0-.07.77c.126.25.383.407.665.407h13.371a.744.744 0 0 0 .665-.407.73.73 0 0 0-.07-.77L8.866 1.23Z"
      fill="#4FBF67"
    />
  </svg>
);

export { UpTriangle };

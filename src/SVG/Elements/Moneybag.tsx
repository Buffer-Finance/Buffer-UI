import * as React from 'react';

const Moneybag = (props) => (
  <svg
    width="26"
    height="33"
    viewBox="0 0 26 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12.9745" cy="12.3046" r="13" fill="var(--money-bag)" />
    <path
      d="M15.3191 10.2588H11.0658C10.2513 11.1898 8.7915 13.0771 8.7915 14.6597C8.7915 15.3744 9.10905 17.7066 13.1925 17.7066C17.2759 17.7066 17.5934 15.3744 17.5934 14.6597C17.5934 13.0771 16.1337 11.1898 15.3191 10.2588Z"
      fill="white"
    />
    <path
      d="M12.854 9.58426V8.23012H13.5311V9.58426H15.0944L16.4486 6.87598H9.93652L11.2907 9.58426H12.854Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2724_31467"
        x1="-11.16"
        y1="12.3046"
        x2="12.9745"
        y2="36.4391"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BBB5E2" />
        <stop offset="1" stopColor="#9C92DF" />
      </linearGradient>
    </defs>
  </svg>
);

export default Moneybag;

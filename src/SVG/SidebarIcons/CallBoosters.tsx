import * as React from "react";
import { SVGProps } from "react";

const HomeIcon = (props: any) => {
  const active = props.active;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.16667 12.25V0H0V12.25C0 12.7141 0.184374 13.1593 0.512563 13.4874C0.840752 13.8156 1.28587 14 1.75 14H14V12.8333H1.75C1.59529 12.8333 1.44692 12.7719 1.33752 12.6625C1.22812 12.5531 1.16667 12.4047 1.16667 12.25Z"
        stroke="currentColor"
        strokeWidth="0.583333"
        fill={active ? "currentColor" : ""}
      />
      <path
        d="M12.3473 3.11084H9.13898L10.7682 4.74009L8.26398 7.24434L7.09731 6.07767L2.88623 10.2888L3.71398 11.1165L7.10023 7.73317L8.2669 8.89984L11.596 5.57076L13.2223 7.19417V5.59001V3.98584C13.2223 3.75378 13.1301 3.53122 12.966 3.36712C12.8019 3.20303 12.5794 3.11084 12.3473 3.11084Z"
        stroke="currentColor"
        strokeWidth="0.583333"
        fill={active ? "currentColor" : ""}
      />
      <path
        d="M10.8889 4.86133L10.8159 4.78827M10.8159 4.78827L9.13892 3.11133H13.2223V7.19466L10.8159 4.78827Z"
        stroke="currentColor"
        strokeWidth="0.583333"
      />
    </svg>
  );
};

export default HomeIcon;

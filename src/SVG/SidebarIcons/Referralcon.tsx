import React from "react";

function ReferrralIcon(props: any) {
  if (props.active) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="20"
        fill="none"
        viewBox="0 0 21 20"
      >
        <path
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3.7 10.793c1.148 0 2.08-.815 2.08-1.82 0-1.005-.932-1.82-2.08-1.82-1.15 0-2.08.815-2.08 1.82 0 1.005.93 1.82 2.08 1.82zM13.779 4.468c1.116 0 2.02-.814 2.02-1.82 0-1.005-.904-1.82-2.02-1.82s-2.02.815-2.02 1.82c0 1.006.904 1.82 2.02 1.82zM13.779 17.118c1.116 0 2.02-.815 2.02-1.82 0-1.005-.904-1.82-2.02-1.82s-2.02.815-2.02 1.82c0 1.005.904 1.82 2.02 1.82z"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M5.94 7.568l5.6-3.514M11.54 13.893l-5.6-3.514"
        ></path>
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      fill="none"
      viewBox="0 0 21 20"
    >
      <path
        fill=""
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.151 5.04c1.116 0 2.02-.773 2.02-1.724 0-.952-.904-1.724-2.02-1.724-1.115 0-2.02.772-2.02 1.724 0 .951.905 1.723 2.02 1.723zM3.072 11.028c1.148 0 2.08-.772 2.08-1.724 0-.951-.932-1.723-2.08-1.723-1.15 0-2.08.772-2.08 1.723 0 .952.93 1.724 2.08 1.724zM13.151 17.017c1.116 0 2.02-.772 2.02-1.724s-.904-1.723-2.02-1.723c-1.115 0-2.02.771-2.02 1.723 0 .952.905 1.724 2.02 1.724zM5.312 7.973l5.6-3.327M10.912 13.962l-5.6-3.327"
      ></path>
    </svg>
  );
}

export default ReferrralIcon;

import React from "react";

function LeaderboardIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="15"
      fill="none"
      viewBox="0 0 21 15"
      className="scale-90"
    >
      <path
        stroke="currentColor"
        fill={props.active ? "currentColor" : ""}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.38 13.727h4.11V8.102h-4.11v5.625zM8.185 13.725h4.01V4.587h-4.01v9.138zM.992 13.723h4.11V1.072H.992v12.651z"
      ></path>
    </svg>
  );
}

export default LeaderboardIcon;

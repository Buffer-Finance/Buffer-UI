import React from "react";

function DownIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="7"
      fill="var(--green)"
      viewBox="0 0 18 17"
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.324 14.035a.83.83 0 01-.625.278.83.83 0 01-.625-.278L1.04 5.205a.7.7 0 01-.074-.771.788.788 0 01.7-.407H15.73c.296 0 .567.158.7.407a.7.7 0 01-.075.77l-7.032 8.83z"
      ></path>
    </svg>
  );
}


export function DownIconWhite({className}:{className:any}) {
  return (
    <svg className={className} width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.19048 9.68836C7.067 9.85105 6.88286 9.94531 6.68852 9.94531C6.49419 9.94531 6.31005 9.85105 6.18657 9.68836L0.539555 1.52569C0.39696 1.31958 0.374023 1.04381 0.480307 0.813357C0.586592 0.582909 0.803853 0.43734 1.04151 0.43734H12.3355C12.5732 0.43734 12.7905 0.582909 12.8967 0.813357C13.003 1.04381 12.9801 1.31958 12.8375 1.52569L7.19048 9.68836Z" fill="white"/>
    </svg>
    
  );
}

export default DownIcon;

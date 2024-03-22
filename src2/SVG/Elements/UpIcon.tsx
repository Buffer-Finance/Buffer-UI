import React from "react";

function UpIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="7"
      fill="none"
      viewBox="0 0 17 12"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.813 1.244a.83.83 0 00-.625-.278.83.83 0 00-.625.278L.53 10.074a.7.7 0 00-.073.77c.132.25.402.408.698.408h14.066a.788.788 0 00.698-.407.7.7 0 00-.073-.77L8.813 1.243z"
      ></path>
    </svg>
  );
}

export function UpIconWhite({className}:{className:any}) {
  return (
    <svg className={className} width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.49026 0.262705C6.372 0.0963736 6.19563 0 6.0095 0C5.82337 0 5.647 0.0963736 5.52874 0.262705L0.120193 8.60813C-0.0163804 8.81886 -0.0383487 9.10081 0.0634474 9.33642C0.165243 9.57202 0.37333 9.72085 0.600953 9.72085H11.418C11.6457 9.72085 11.8538 9.57202 11.9556 9.33642C12.0573 9.10081 12.0354 8.81886 11.8988 8.60813L6.49026 0.262705Z" fill="white"/>
    </svg>
    
  );
}

export default UpIcon;

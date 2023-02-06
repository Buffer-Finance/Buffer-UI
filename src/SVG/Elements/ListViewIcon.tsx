import * as React from "react";

const ListViewIcon = (props) => {
  const fill = props.active ? "var(--bg-20)" : "var(--bg-14)";
  return (
    <svg
      width={32}
      height={27}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill={fill} width={8.889} height={7.105} rx={1} />
      <rect fill={fill} x={10.667} width={21.333} height={7.105} rx={1} />
      <rect fill={fill} y={9.948} width={8.889} height={7.105} rx={1} />
      <rect
        fill={fill}
        x={10.667}
        y={9.948}
        width={21.333}
        height={7.105}
        rx={1}
      />
      <rect fill={fill} y={19.895} width={8.889} height={7.105} rx={1} />
      <rect
        fill={fill}
        x={10.667}
        y={19.895}
        width={21.333}
        height={7.105}
        rx={1}
      />
    </svg>
  );
};

export default ListViewIcon;

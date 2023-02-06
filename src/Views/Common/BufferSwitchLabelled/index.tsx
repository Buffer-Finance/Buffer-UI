import * as React from "react";
import { Typography } from "@mui/material";
import { ReactElement } from "react";
import BufferSwitch from "@Views/Common/BufferSwitch";

interface IBufferSwitchLabelled {
  value: boolean;
  label: string | number | ReactElement;
  onChange: () => void;
}

const BufferSwitchLabelled: React.FC<IBufferSwitchLabelled> = ({
  value,
  label,
  onChange,
}) => {
  return (
    <div className={"flex text-1 items-center"}>
      <BufferSwitch value={value} onChange={onChange} />
      <Typography
        style={{
          position: "relative",
          bottom: "0.2rem",
          // fontFamily: "Relative Pro",
        }}
        sx={{ fontSize: 13.5 }}
      >
        {label}
      </Typography>
    </div>
  );
};

export default BufferSwitchLabelled;

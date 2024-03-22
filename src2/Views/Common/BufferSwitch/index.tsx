import * as React from "react";
import SwitchUnstyled, {
  switchUnstyledClasses,
} from "@mui/base/SwitchUnstyled";
import BufferStyles from "./style";

const blue = {
  500: "#007FFF",
};

const grey = {
  400: "#BFC7CF",
  500: "#AAB4BE",
  600: "#6F7E8C",
};

interface IBufferSwitch {
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
  title?: string;
}

const BufferSwitch: React.FC<IBufferSwitch> = ({
  value,
  onChange,
  title,
  disabled,
}) => {
  const label = {
    componentsProps: {
      input: { "aria-label": "Demo switch" },
    },
  };
  const [val, setVal] = React.useState(false);
  return (
    <div title={title}>
      <SwitchUnstyled
        component={BufferStyles}
        {...label}
        checked={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default BufferSwitch;

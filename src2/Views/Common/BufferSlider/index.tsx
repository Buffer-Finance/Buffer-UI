// @ts-nocheck
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";

import Background, { SliderWithStyles, SliderTooltip } from "./style";
interface IBufferSlider {
  percentage: number;
  setPercentage: (a: number) => void;
  left?: any;
  className?: string;
  isCallbooster?: boolean;
  min?: number;
  max?: number;
}
const theme = createTheme({});

const BufferSlider: React.FC<IBufferSlider> = ({
  percentage,
  setPercentage,
  left,
  className,
  isCallbooster = false,
  min,
  max,
}) => {
  const handleChang = (_, val: any) => setPercentage(val);

  return (
    <ThemeProvider theme={theme}>
      <Background className={left === 1 ? "slider-box" : className}>
        <SliderWithStyles
          aria-label="By"
          valueLabelDisplay="auto"
          getAriaValueText={formatValue}
          valueLabelFormat={formatValue}
          onChange={handleChang}
          min={!isCallbooster ? -50 : min}
          max={!isCallbooster ? 50 : max}
          value={percentage}
        />
        {left === 1 ? (
          <div className="percentage-box">
            {percentage > 0 ? "+" : ""}
            {percentage}%
          </div>
        ) : (
          left
        )}
      </Background>
    </ThemeProvider>
  );
};

export default BufferSlider;

const formatValue = (value: number) => {
  const str = `${value > 0 ? "+" : ""}${value}%`;
  return str;
};

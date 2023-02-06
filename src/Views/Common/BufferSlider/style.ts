import { Slider, Tooltip } from "@mui/material";
import { withStyles } from "@mui/styles";
import styled from "styled-components";

const Background = styled.div`
  margin: auto;
  .MuiSlider-thumb.Mui-focusVisible,
  .MuiSlider-thumb:hover {
    box-shadow: none;
  }
  .percentage-box {
    font-weight: 600;
    font-size: 1.2rem;
    color: var(--primary);
    padding: 6px;
    background: var(--bg-20);
    border-radius: 6px;
    padding-bottom: 4px;
    width: 4.5rem;
    text-align: center;
  }
  &.slider-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 2rem;
    justify-content: space-between;
  }
`;
export default Background;

export const SliderWithStyles = withStyles((theme) => ({
  root: {
    width: "80%",
    display: "flex",
    color: "var(--bg-14)",
    [theme.breakpoints.down("sm")]: {
      width: "85%",
      marginRight: "0px",
    },
  },
  thumb: {
    height: "20px",
    width: "20px",
    borderRadius: "24px",
    marginTop: 0,
    border: "3px solid var(--slider)",
    marginLeft: -3,
    backgroundColor: "var(--calc)",
  },
  valueLabel: {
    // fontFamily: "Relative Pro",
    color: "var(--text-1)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: "-5px",
    padding: "4px 6px",
    borderRadius: "6px",
    background: "var(--bg-14)",
    "&:before": {
      display: "none",
    },
  },
  track: {
    height: 6.5,
    borderRadius: 8,
  },
  rail: {
    height: 6.5,
    borderRadius: 20,
    opacity: 1,
  },
}))(Slider);

export const SliderTooltip = withStyles({
  tooltip: {
    color: "var(--text-1)",
    fontSize: 16,
    fontWeight: 600,
    backgroundImage: "var(--bg-14)",
  },
})(Tooltip);

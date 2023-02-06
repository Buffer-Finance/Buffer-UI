import styled from "styled-components";

const Background = styled.div`
  position: relative;
  margin-bottom: 10px;
  .tradingview-skel {
    position: absolute;
    background-color: var(--bg-8);
    width: 100%;
    height: 50vh;
    border-radius: 0.7rem;
  }
  .custom-graph-loader {
    width: 100%;
    height: 40rem;
    border-radius: 1.3rem;
  }
  .App {
    position: relative;
  }
  .chart-container {
    border-radius: 1rem;
    overflow: hidden;
  }
  .TVChartContainer {
    width: 100%;
    height: 100%;
  }
`;
export default Background;

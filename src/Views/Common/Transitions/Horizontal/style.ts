import styled from '@emotion/styled';

const Background = styled.div`
  /* overflow-x: hidden; */

  .tab-pannel {
    transition: 100ms;
  }
  .tab-pannel--enter {
    transform: translate(-100px, 0);
    opacity: 0;
  }
  .tab-pannel--enter-active {
    opacity: 1;
    transform: translate(0, 0);
  }
  .tab-pannel--exit {
    opacity: 0;
    transform: translate(60%, 0);
  }
  .TVChartContainer {
    min-height: 100%;

    @media only screen and (max-width: 1200px) {
      height: calc(100vh - 350px);
    }
  }
`;
export default Background;

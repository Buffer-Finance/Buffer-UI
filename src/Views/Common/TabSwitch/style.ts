import styled from "styled-components";

const Background = styled.a`
  .tab-pannel {
    margin-top: 1rem;
    transition: 200ms;
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
`;
export default Background;

import styled from '@emotion/styled';

const Background = styled.a`
  & ::-webkit-scrollbar {
    background: var(--bg-grey);
    height: 2px !important;
    width: 3px !important;
  }
  .tab-pannel {
    margin-top: 1rem;
    transition: 200ms;
    overflow: auto;
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

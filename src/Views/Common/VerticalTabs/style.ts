import styled from "styled-components";

const Background = styled.div`
  width: fit-content;
  height: 100%;
  .hide {
  }
  .vertical-tabs-root {
    color: var(--text-1);
    font-weight: 400;
    width: fit-content;
    transform: translateX(0.4rem);
  }
  .vertical-indicator-style {
    width: 0.44rem;
    background: var(--primary);
  }
  .root-button {
    color: var(--text-6);
    font-weight: 400;
    font-family: Relative Pro;
    padding: 0rem;
    width: 8rem;
    text-transform: capitalize;
    border-right: 3px solid rgba(0, 0, 0, 0.3);
    .img,
    svg {
      margin-bottom: 1.4rem;
    }
    margin: 1.5rem 0rem;
    margin-left: -1rem;
    &:hover {
      color: var(--text-1);
    }
  }
  .selected-button {
    color: var(--text-1) !important;
    font-weight: 500;
  }
  .left-pannel-skel {
    width: 100%;
    height: 100%;
  }
`;
export default Background;

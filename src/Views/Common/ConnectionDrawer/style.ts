import styled from "styled-components";

const Background = styled.div`
  font-family: Relative Pro;
  &.default-closed {
    position: relative;
    height: 100%;
    top: 0;
    /* bottom: 0; */
    left: 0;
    right: 0;
    /* background-color: var(--bg-4); */
    /* left: 0; */
    transform: translateX(120%);
    transition: 200ms ease-in-out;
    z-index: 1000;
  }
  &.open {
    transform: translateX(0%);
  }
  .header {
    margin-bottom: 2rem;
  }

  .wallet {
    display: flex;
    width: 100%;
    justify-content: space-between;
    /* background: var(--bg19-white); */
    padding: 1.8rem 2.2rem;
    margin-bottom: 0.8rem;
    border-radius: 9px;
    font-size: 1.4rem;
    text-transform: none;
    color: var(--text-1);
    .label {
      font-family: "Relative Pro";
    }
    .wallet_img {
      width: 2.4rem;
      height: 2.4rem;
    }
    .big {
      width: 50px;
    }
    /* &:hover {
      background: var(--bg-14);
    } */
  }
  .msg-text {
    text-align: center;
    margin-top: 3.8rem;
    font-size: 1.3rem;
    color: var(--text-1);

    .metamask-link {
      all: unset;
      color: var(--bg-20);
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
export default Background;

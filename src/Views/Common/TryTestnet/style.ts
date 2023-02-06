import styled from "styled-components";

const Background = styled.div`
  background-color: var(--bg-21);
  border-radius: 1rem;
  padding: 2rem;
  /* position: absolute; */
  position: relative;
  /* bottom: 0; */
  /* bottom: 4rem; */
  /* width: calc(var(--drawer-width) - 8rem); */

  /* margin-top: 36vh; */
  transition: 0.2s all;

  @media only screen and (max-width: 1200px) {
    bottom: -9px;
    /* right: auto;
    width: calc(var(--drawer-width) - 9.5rem); */
  }
  .cross-icon-wrapper {
    position: absolute;
    top: 0.4rem;

    right: 0.4rem;
    .cross-icon {
    }
  }
  .testTxt {
    color: var(--text-8);
    font-size: 1.4rem;
    width: 55%;
    font-weight: 600;
    line-height: 2.5rem;
    margin-bottom: 0.7rem;
    margin-top: 0rem;
  }
  .testBtn {
    background-color: white;
    color: var(--text-8);
    font-size: 1.4rem;
    font-weight: 600;
    text-transform: capitalize;
    &:hover {
      background-color: var(--text-1);
    }
  }
  .testImg {
    position: absolute;
    bottom: -16%;
    right: -10%;
    width: 18rem;
    height: 16rem;
  }
`;
export default Background;

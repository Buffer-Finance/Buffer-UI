import styled from "styled-components";

const Background = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  transition: transform 300ms ease-in;
  height: 100%;
  transform: translate(0px, 400px) scaleY(0);
  opacity: 0;
  background-color: var(--bg-23);
  z-index: 1000;
  &.active {
    opacity: 1;
    transform: translate(0px, 0px) scaley(1);
  }
  @media (max-width: 600px) {
    position: fixed;

    height: 70vh;
    top: 50%;
    left: 50%;
    width: 90vw;
    &.active {
      transform: translate(-50%, -50%) scaley(1);
    }
  }
  #graphmodal {
    height: 100%;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    /* z-index: 1000; */
    border-top-left-radius: 1.4rem;
    border-top-right-radius: 1.4rem;
  }
  .icon-btn {
    z-index: 1300;
    position: absolute;
    top: 0px;
    right: 0px;
    color: var(--bg-sec-d);
    padding: 0rem;
    transform: scale(1.1) translate(20%, -20%);
  }
`;
export default Background;

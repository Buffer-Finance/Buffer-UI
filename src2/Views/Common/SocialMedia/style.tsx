import styled from "styled-components";

const Style = styled.footer`
  background-color: var(--bg-19);
  padding: 1.3rem 2.5rem;
  z-index: 900;
  transition: ease-in;
  transition-duration: var(--drawer-transition-duration);
  left: 0px;

  @media screen and (max-width: 600px) {
    padding: 1.3rem 1rem;
  }
  .social_link:not(:last-child) {
    margin-right: 1.7rem;
  }

  .social_link_icon {
    transform: rotateZ(0deg);
    transition: transform 0.2s ease-in-out;
    &:hover {
      filter: drop-shadow(0px 0px 7px var(--primary)) brightness(1.3);
      transform: rotateZ(20deg);
      /* color: red; */
    }
  }
  @media only screen and (max-width: 600px) {
    &.sidebar-closed {
      left: 0rem;
    }
    padding: 0.5rem 0;
    display: none;
    left: 0;
    .social {
      display: none;
    }
    .badge {
      display: none;
    }
  }
`;

export default Style;

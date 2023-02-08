import styled from '@emotion/styled';

const TImerStyle = styled.div`
  transition: ease-in;
  transition-duration: var(--drawer-transition-duration);
  display: flex;
  gap: 8px;
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
`;

export default TImerStyle;

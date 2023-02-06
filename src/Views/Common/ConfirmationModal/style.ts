import styled from "@emotion/styled";

const ConfirmationModalStyles = styled.div`
  /* color: var(--text-1); */

  .header {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 4rem;
    &::after {
      content: "";
      height: 1px;
      position: absolute;
      width: 100%;
      /* margin: auto; */
      top: 13rem;
      /* bottom: 0; */
      right: 0;
      left: 0;
      border-bottom: 1px solid var(--bg-14);
    }
    .successIcon {
      max-width: 2.4rem;
      margin-right: 0.5rem;
    }
    .text {
      font-size: 2rem;
    }
    .sub-text {
      font-size: 1.5rem;
    }
    .link {
      font-size: 1.2rem;
      :hover {
        color: var(--bg-20);
        cursor: pointer;
      }
    }
  }

  .image-wrapper {
    max-width: 2.5rem;
    margin-right: 0.5rem;
  }
  .main {
    & :first-of-type {
      align-items: flex-start;
    }
    display: flex;
    gap: 7rem;
    justify-content: space-between;
    align-items: center;

    .head {
      font-size: 1.4rem;
      color: var(--text-6);
    }
    .desc {
      margin-top: 0.5rem;
      font-size: 1.7rem;
    }
  }

  .foot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin-top: 6rem;
  }
`;

const SocialStyles = styled.div`
  margin-top: 1.4rem;
  .socialTip {
    position: relative;
    :hover {
      .socialTipText {
        visibility: visible;
      }
    }
  }
  .socialTipText {
    background-color: #11141b;
    padding: 0.6rem 1rem 0.8rem;
    border-radius: 4px;
    visibility: hidden;
    position: absolute;
    top: -4.7rem;
    font-size: 1.4rem;
  }
  .footer {
    border-radius: 500px;
    padding: 1.2rem 2.5rem;
    background: #11141b;
    backdrop-filter: blur(30px);
  }
  .mar {
    margin: 0 1rem;
    :first-of-type {
      margin-left: 0;
    }
    :last-of-type {
      margin-right: 0;
    }
  }
  .icon {
    color: var(--bg-20);
    width: 28px;
    height: 28px;
    transition: 0.2s;

    &:hover {
      transform: rotate(12deg);
      filter: drop-shadow(0 0 10px var(--social-shadow));
      /* color: var(--social-text); */
    }
  }
  @media (max-width: 460px) {
    left: 50%;
    transform: translate(-50%, 0);
    right: unset;
  }
`;
export { ConfirmationModalStyles, SocialStyles };

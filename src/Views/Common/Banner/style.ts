import styled from "@emotion/styled";

const Background = styled.div`
  p {
    margin: 0;
  }
  .modal {
    background-color: var(--bg-19);
    border-radius: 2rem;
    position: fixed;
    margin: auto;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1500;
    color: var(--text-1);
    max-width: 460px;
    height: fit-content;
    padding: 3.5rem;
    gap: 3rem;

    @media only screen and (max-width: 600px) {
      max-width: 300px;
      gap: 2rem;
      padding: 2.5rem;
    }

    .head {
      font-size: 1.8rem;
      text-align: start;

      @media only screen and (max-width: 600px) {
        font-size: 1.6rem;
      }
    }

    .desc {
      gap: 2rem;
      font-size: 1.4rem;
      color: var(--text-6);
      @media only screen and (max-width: 600px) {
        font-size: 1.2rem;
        gap: 1.5rem;
      }
    }

    .btn {
      border-radius: 6px !important;
      padding: 1rem 0;
      font-size: 1.4rem;
      @media only screen and (max-width: 600px) {
        font-size: 1.2rem;
      }
    }
  }

  .layer {
    position: fixed;
    background: var(--bg-17);
    opacity: 0.85;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1400;
  }
`;

export { Background };

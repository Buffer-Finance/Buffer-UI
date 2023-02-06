import styled from "@emotion/styled";

const Background = styled.div`
  width: 43rem;
  height: 40rem;
  p {
    margin: 0;
  }
  .buyModalSkel {
    width: 39rem;
    height: 39rem;
    border-radius: 1.4rem;
  }
  .headd {
    color: var(--text-6);
    font-size: 1.4rem;
  }
  .ip_skel {
    width: 43rem;
    height: 4.7rem;
    border-radius: 0.8rem;
  }

  .ibfr-faucet-link {
    &:hover {
      text-decoration: underline;
    }
    svg {
      transform: scale(0.7);
      transform-origin: bottom;

      object-fit: cover;
    }
  }
  .btn-skels {
    width: 100%;
    height: 4.2rem;
    border-radius: 1rem;
  }
  .btn-skelss {
    width: 21rem;
    height: 4.2rem;
    border-radius: 1rem;
  }
  .dta {
    min-width: 21rem;
    display: flex;
  }
  .descc {
    color: var(--text-1);
    font-size: 1.6rem;
    margin-top: 3px;
  }
  .border-div {
    width: 100%;
    height: 1px;
    background-color: var(--bg-14);
    transform: scaleX(1.15);
    margin-top: 1.5rem;
    margin-bottom: 3rem;
  }
  .hero-head {
    color: var(--text-1);
    font-size: 1.4rem;
  }
  .bottom-container {
    display: flex;
    width: 100%;
    align-items: center;
    column-gap: 1rem;
    justify-content: space-between;
  }
  .hero-desc {
    color: var(--text-1);
    font-size: 1.4rem;
  }
  .data-row {
    gap: 6rem;
  }
  .image-wrapper {
    width: auto;
    height: 3.2rem;
    margin-right: 0.7rem;
  }
  .btn-container {
    display: flex;
    column-gap: 1.3rem;
    &.connect-btn {
      width: 17rem;
    }
  }

  .button {
    font-family: Relative Pro;
    font-size: 1.4rem;
    padding: 0.5rem 0.1rem;
    width: 9rem;
    /* min-width: 14rem; */
    white-space: nowrap;
    &.full-width {
      width: 100%;
    }

    &.disbale {
      background: var(--bg-8);
      color: var(--text-6);

      cursor: not-allowed;
      &:hover {
        transform: none;
      }
    }
  }
  .max-button {
    color: var(--bg-20);
    :hover {
      color: var(--primary);
      cursor: pointer;
    }
  }
  .bgColor {
    .background {
      background-color: var(--dropdown-hover);
      /* background-color: var(--calc); */
    }
  }
  .cancel {
    background-color: var(--dropdown-hover);
    color: var(--text-6);
    border: none;
  }
  .last-row {
    gap: 8rem;
  }
`;

export { Background };

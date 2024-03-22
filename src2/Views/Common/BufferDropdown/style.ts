import styled from 'styled-components';

const Background = styled.div`
  height: 100%;
  .message {
    color: var(--text-6);
    font-size: 1.2rem;
  }
  .mobile-drop {
    @media (max-width: 600px) {
      transform: translateX(-80%) !important;
    }
  }
  .dropdown-box {
    /* z-index: 2; */
    position: relative;
    border-radius: 10px;
    border: 2px solid var(--bg-sec-l);
    height: 100%;

    .primaryBtn {
      padding: 0.6rem 1.2rem 0.6rem 1.5rem;
    }
    cursor: pointer;
    .dropdown-items,
    .chain-dropdown-items {
      display: flex;
      flex-direction: column;
      position: absolute;
      z-index: 10000;
      left: 50%;
      transform: translateX(-50%) scale(0.7, 0.3);
      top: calc(100% + 10px);
      opacity: 0;
      pointer-events: none;
      width: fit-content;
      /* background-color: var(--bg19-white); */
      /* color: var(--text-1); */

      box-shadow: var(--white-shadow);
      border-radius: 1rem;
      transition: 100ms ease-out;
      transform-origin: 50% 0%;
      overflow: hidden;
    }
    .dropdown-items--enter {
    }
    .dropdown-items--enter-active {
    }

    .dropdown-items--enter-done {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) scale(1);
      width: 100%;
      box-shadow: var(--white-shadow);
      @media (max-width: 600px) {
        /* transform: translateX(-64%) scale(1); */
      }
    }
    .chain-dropdown-items--enter {
    }
    .chain-dropdown-items--enter-active {
    }

    .chain-dropdown-items--enter-done {
      opacity: 1;
      width: fit-content;
      pointer-events: auto;
      transform: translateX(-50%) scale(1);
      box-shadow: var(--white-shadow);
      @media (max-width: 600px) {
        /* transform: translateX(-42%) scale(1); */
        transform: translateX(-64%) scale(1);
      }
    }
    .dropdown-items--enter-done.chain-dropdown-bottom {
      @media (max-width: 800px) {
        transform: translateY(calc(-100% - 5px)) translateX(-50%) scale(1) !important;
        top: 0%;
      }
    }
    .chain-dropdown-exit--enter {
    }
    .chain-dropdown-exit--enter-active {
    }
    .chain-dropdown-exit--enter-done {
    }
    .dropdown-value {
      width: auto;
    }
    .dropdown-icon {
      transition: transform 400ms ease;
      width: 1.2rem;
      height: 0.8rem;
    }

    .item-img {
      width: 2rem;
      object-fit: none;
      margin-right: 1rem;
      border-radius: 50%;
      &.sm {
        width: 1.7rem;
        height: 1.7rem;
      }
    }
    &.bottom {
      .dropdown-items {
        bottom: auto;
        top: 40%;
      }
      .dropdown-icon {
        transform: rotateZ(180deg);
      }
    }

    &.active-bottom {
      .dropdown-items {
        opacity: 1;
        pointer-events: auto;
        top: 100%;
      }
      .dropdown-icon {
        transform: rotateZ(0deg);
      }
    }
  }
`;
export default Background;

import styled, { keyframes } from 'styled-components';

const SidebarCSS = styled.div`
  .bbborderrr {
    padding-top: 15px;
    padding-bottom: 10px;

    border-top: 1px solid #4a4646;
    border-bottom: 1px solid #4a4646;
  }
  .collapse-icon {
    color: var(--text-1);
    display: none;
    padding: 0;
  }
  .bufferlogotext {
    /* font-family: Poppins; */
    font-size: 2.3rem;
    color: var(--text-1);
    font-weight: 500;
    margin-left: 0.4rem;

    @media only screen and (max-width: 1200px) {
      font-size: 1.7rem;
      font-weight: 600;
      line-height: 20px;
    }
  }
  .sidebar {
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    position: fixed;
    height: 100%;
    top: 0;
    left: 0;
    /* background: var(--bg-17); */
    transition: 200ms ease-in;
    z-index: 1600;
    border-right: 2px solid var(--bg-8);
    width: 50%;
    padding-bottom: calc(var(--top-banner-height) + 1.2rem);
    .icon_container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: calc(var(--navbar-height) - 0.5rem);
      padding-left: 1.4rem;
      padding-right: 0.5rem;
      /* margin-bottom: 0.4rem; */
      margin-top: 0.3rem;

      .buffer-logo {
        color: var(--text-1);
        width: 3.7rem;
        height: 3.4rem;

        @media only screen and (max-width: 1200px) {
          width: 24.67px;
          height: 24.67px;
        }
      }
    }

    .dropdown {
      display: flex;
      /* color: var(--text-1); */
      justify-content: flex-start;
      margin: auto;
      width: 100%;
      padding: 1em 2rem;
      text-transform: capitalize;
      border-radius: 1.2rem;
      height: 4.2rem;
      align-items: center;
      /* font-family: "Inter", sans-serif; */
      font-weight: 400;
      font-size: 1.4rem;
      transition: 80ms ease;
      margin-bottom: 0.3rem;
      &:hover {
        /* color: var(--text-blue); */
      }
    }

    .dropdown-box {
      /* background-color: var(--bg-19); */
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;

      .dropdown-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: var(--text-6);
        width: 100%;
        height: 4.2rem;
        text-transform: capitalize;
        border-radius: 1.2rem;
        /* font-family: "Inter", sans-serif; */
        font-weight: 400;
        font-size: 1.4rem;
        padding: 1em 2rem;
        margin: auto;
        margin-bottom: 0.3rem;
        transition: 80ms ease;
        &:hover {
          color: var(--text-blue);
        }
      }
    }

    .item {
      display: flex;
      /* background: var(--bg-17); */
      color: var(--text-6);
      justify-content: center;
      margin: auto;
      width: 100%;
      padding: 1em 2rem;
      text-transform: capitalize;
      border-radius: 1.2rem;
      height: 4.2rem;
      align-items: center;
      /* font-family: "Inter", sans-serif; */
      font-weight: 400;
      font-size: 16px;
      transition: 80ms ease;
      margin-bottom: 0.3rem;
      &:hover {
        color: var(--text-blue);
      }
    }
    .name {
      /* margin-left: 1.8rem; */
      white-space: nowrap;
    }
    .liftup {
      transform: translateY(-2px);
    }
    .active {
      /* background: var(--bg-19); */
      color: var(--text-blue) !important;
      .name {
        /* margin-left: 1.6rem; */
      }
    }
    .buttons-container {
      display: flex;
      column-gap: 0.8rem;
      justify-content: center;
      align-items: center;
      padding-bottom: 0.5rem;
    }

    .bottom {
      display: flex;
      margin-top: auto;
      flex-direction: column;
      width: var(--sidepanel-width);
      transition: opacity 10ms;
      .balanceWrapper {
        background: var(--bg-14);
        border-radius: 1rem;
        padding: 0.7rem 1.4rem;
        &:hover {
          .favIcon {
            transform: scale(1.1);
            filter: drop-shadow(0px 0px 10px #2aaecc82);
          }
        }
        .favIcon {
          width: 2.5rem;
          height: 2.5rem;
          transition: 0.4s;
          margin-right: 0.7rem;
        }
        .balanceText {
          font-size: 1.4rem;
          color: var(--text-1);
        }
      }
      .buyButton {
        color: var(--primary);
        background: var(--bg-20);
        font-size: 1.4rem;
        border-radius: 1rem;
        font-weight: 600;
        text-transform: none;
        padding: 0.7rem 1.4rem;
      }
    }
    .lowerIconsContainer {
      margin: 0.8rem;
      margin-top: 1.8rem;

      .icon-btn {
        padding: 0;
      }
      .globe-icon {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  }

  .sidebar_container {
    width: 100%;
    /* padding-left: 0.8rem;
    padding-right: 0.8rem; */
  }
  @media only screen and (min-width: 1200px) {
    .sidebar-closed {
      width: 8rem;
      .name {
        display: none;
        visibility: hidden;
        transition: ease-in;
      }
      .buttons-container {
        display: none;
      }
      .icon_container {
        width: 5.5rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 10px;
        /* margin-bottom: 10px; */
        img {
          margin-bottom: 10px;
        }
        svg {
          transform: rotate(-180deg);
        }
      }
      .item {
        width: fit-content;
        margin: none;
        transform: scale(0.95);
      }
      .active {
        width: 1rem !important;
        display: flex;
        visibility: visible;
        justify-content: center;
        padding: 0 !important;
      }
    }
  }

  /* @media only screen and (max-width: 1200px) {
    .collapse-icon {
      display: flex;
      padding: 0;
    }
  } */
  @media only screen and (max-width: 1200px) {
    .overlay {
      position: fixed;
      background-color: rgba(0, 0, 0, 0.4);
      height: 100vh;
      width: 100vw;
      z-index: 999;
      top: 0;
      /* margin-top: 9.5rem; */
    }

    .icon_container {
      top: 0;
      padding-top: 2rem;
      margin-top: 0 !important;
      padding-left: 3rem !important;
      transform: translateX(-1rem);
      .buffer-logo {
        height: none;
        width: 11rem;
        box-sizing: border-box;
      }
    }
    .sidebar {
      transform: translateX(-100%) !important;
      top: 0;
    }
    .sidebar-closed {
      transform: translateX(0) !important;
    }
    .buttons-container {
      display: none !important;
    }
    .arrow {
      /* color: var(--text-1); */
      transition: 100ms ease;
      font-size: 2rem;

      transform: rotateZ(0deg);
      &.rotate {
        transform: rotateZ(180deg);
      }
    }
  }
`;
export default SidebarCSS;

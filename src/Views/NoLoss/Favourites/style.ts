import styled from "styled-components";

const Background = styled.div`
  .dd-wrapper {
    display: flex;
    /* padding-top: 9px; */
    /* column-gap: 1.2rem; */
    align-items: center;

    .scrollbar {
      ::-webkit-scrollbar {
        background: var(--bg-grey);
        height: 1px;
        width: 0px;
        @media (min-width: 800px) {
          height: 0px;
        }
      }
    }
    .before-border {
      ::before {
        background-color: #232334;
        content: "";
        position: absolute;
        height: 100%;
        width: 2px;
        left: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        z-index: -1;
      }
    }
    .after-border {
      &:last-of-type {
        &::after {
          z-index: -1;
          background-color: #232334;
          content: "";
          position: absolute;
          height: 100%;
          width: 2px;
          right: 0;
          bottom: 0;
          top: 0;
          margin: auto;
        }
      }
    }
  }

  .left-border-needed {
    &::after {
      content: "";
      height: 100%;
      width: 10px;
      position: absolute;
      top: 0px;
      right: -10px;
      /* z-index: 10000; */
      border-radius: 0 0 0 25px;
      box-shadow: 0 25px 0 0 #131722;
    }
    &::before {
      content: "";
      height: 100%;
      width: 10px;
      position: absolute;
      top: 0px;
      /* z-index: 10000; */
      border-radius: 16px 0 25px 0;
      box-shadow: 0 25px 0 0 #131722;
      left: -10px;
    }
  }

  @media (max-width: 500px) {
    /* margin: 0px 5px; */
  }
  .asset-dropdown-wrapper {
    position: absolute;
    top: calc(100% + 1rem);
    z-index: 2000;
    width: min(calc(100vw - 10px), 520px);
    @media (max-width: 1200px) {
      padding: 0rem;
      border-radius: 9px;
      width: 100%;
      border: 2px solid var(--bg-4);
    }
  }
  .cross-iconmm {
    background-color: #242731;
    /* position: absolute; */
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    padding: 0rem;
    right: -0.4rem;
    top: -0.4rem;
    /* color: white; */
    span.crrr {
      font-size: 1rem;
      transform: scaleX(1.8) scaleY(1.4);
    }
    &:hover {
      background-color: #242731;
    }
  }
  .fav-card {
    background: #0e1014;
    /* border-radius: 1.1rem; */
    position: relative;
    color: white;
    display: grid;
    /* padding: 0.8rem 1.2rem 0.4rem 1.2rem; */
    grid-template-areas:
      "img name"
      "img perc";
    grid-column-gap: 0.5rem;
    &:hover {
      background-color: #292c34;
      transform: scale(1.03);
    }
    transition: 100ms ease-in-out;
    &:active {
      transform: scale(0.97);
    }
    .img {
      grid-area: img;
      width: 2rem;
      height: 2rem;
      align-self: flex-start;
      border-radius: 50%;
      object-fit: cover;
      margin-top: 0.3rem;
      margin-right: 0.2rem;
    }
    .name {
      grid-area: name;
      font-weight: 500;
      font-size: 1.4rem;
    }
    .arrow {
      display: none;
      pointer-events: none;
      grid-area: arrow;
    }
    .perc {
      grid-area: perc;
      font-weight: 500;
      justify-self: flex-start;
      font-size: 1.5rem;
    }
    &.light {
      &:hover {
        transform: scale(1);
      }
      &:active {
        transform: scale(1);
      }
      background-color: #353945;
      .cross-iconmm {
        display: none;
        pointer-events: none;
      }
      .arrow {
        display: block;
        pointer-events: all;
      }
    }
    cursor: pointer;
  }
`;
export default Background;

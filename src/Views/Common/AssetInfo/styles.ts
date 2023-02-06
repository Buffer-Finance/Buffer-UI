import styled, { keyframes } from "styled-components";

const Style = styled.div`
  height: 8rem;
  background-color: var(--bg-19);
  border-radius: 1.6rem;
  /* overflow: hidden; */
  margin-top: 2rem;

  .asset {
    border-radius: 1.6rem 0px 0px 1.6rem;
    /* padding-left: 2.2em; */
    /* margin-right: 2rem; */
    flex: 1;
    @media screen {
      flex: none;
      width: fit-content;
    }
    cursor: hover;
    .assetImage {
      /* margin-top: -1rem; */
      margin-right: 1.4rem;
      --dim: 2.7rem;
      width: var(--dim);
      height: var(--dim);
      border-radius: 50%;
      @media (max-width: 600px) {
        margin-right: 0.8rem;
      }
    }
    .assetName {
      color: var(--text-1);
      font-size: 2rem;
      line-height: 1.6rem;
      font-weight: 400;
      .assetCode {
        @media (max-width: 600px) {
          font-size: 1.9rem;
        }
        margin-bottom: 0.5rem;
      }
    }
  }
  .fix-wi {
    min-width: 16rem;
    flex: 1;
    padding: 0 2.1rem;
    @media (max-width: 1200px) {
      min-width: auto;
    }
  }
  .asset-picker-icon {
    width: 18px;
    height: 16px;
    transform: rotate(270deg);
  }
  .switch-asset-btn {
    font-weight: 400;
    display: flex;
    justify-content: flex-end;
    margin-right: 2.5rem;
    align-items: center;
    flex: 1;
    font-size: 1.5rem;
    color: var(--text-1);
    /* font-size: 16px; */
  }
  .arrow {
    width: 1.6rem;
    height: 1.2rem;
  }
  .movement {
    background-color: var(--bg-23);
    padding: 0 2.1rem;
    /* border-right: 2px solid var(--bg-14); */
    flex: 1;
    font-size: 1.4rem;

    :last-child {
      border-top-right-radius: 1.6rem;
      border-bottom-right-radius: 1.6rem;
    }
    .up {
      color: var(--text-6);
      /* line-height: 1.6rem; */
      /* margin-bottom: 0.5rem; */
    }
    .red {
      color: var(--red);
    }
    .down {
      color: var(--text-6);
      /* line-height: 1.6rem; */
      .change {
        color: var(--text-7);
      }
    }
    .arrowUp {
      color: var(--text-7);
      width: 1.4rem;
      height: 1rem;
    }
  }
  .mobile-price {
    @media (max-width: 600px) {
      font-size: 1.5rem;
    }
  }
  .assetPrice {
    border-radius: 0 1.6rem 1.6rem 0;
    border-right: none;
    padding-right: 2.5rem;
    flex: 1;
    .chartButton {
      color: var(--text-1);
      background: var(--bg-19);
      /* border: 1px solid var(--bg-14); */
      border-radius: 10px;
      padding: 0.6rem 1rem;
      font-size: 1.4rem;
      text-transform: capitalize !important;
      /* svg {
        transform: scale(1.2);
        margin-right: 0.4rem;
      } */
      /* @media (min-width: 1800px) {
        font-size: 1.2rem;
        padding: 0.6rem 0.8rem;
        font-size: 1.4rem;
        svg {
          transform: scale(1.4);
        }
      } */
    }
  }
`;
export default Style;

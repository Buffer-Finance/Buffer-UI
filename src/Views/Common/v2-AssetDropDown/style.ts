import styled from "@emotion/styled";

const Background = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  color: var(--text-6);
  margin-bottom: 2rem;
  /* overflow: visible; */

  .back-icon {
    display: none;
    @media only screen and (max-width: 1200px) {
      display: inline;
    }
  }

  .info--text {
    color: var(--text-1);
    font-size: 1.4rem;
    width: 100%;
    text-align: center;
    padding: 2rem 0;
  }
  .marketSearch {
    margin-bottom: 5.7rem;
    flex: 1;
  }
  .input {
    padding: 0.7rem 0rem;
    margin-top: 0.6rem;
  }
  .assetList {
    .f14 {
      font-size: 1.4rem;
    }
    background-color: var(--v2-text-box);
    border-radius: 1rem;
    margin-top: 1.2rem;
    /* margin-bottom: 3rem; */
    max-height: 40vh;
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;
    transition: all 1s ease-in-out;
    overflow: auto;
    @media only screen and (max-width: 600px) {
      max-height: 60vh;
    }
    transition: 0.2s ease-out;
    &.increase-height {
      max-height: 68vh;
    }
    &::-webkit-scrollbar {
      background: transparent;
      height: 7px;
      width: 7px;
    }

    .assets {
      padding: 0.9rem 2.5rem 0.9rem 2.5rem;
      .assetImage {
        width: 2.3rem;
        height: 2.3rem;
        margin-right: 1rem;
      }
      .assetName {
        font-size: 1.6rem;
      }
      .assetPrice {
        font-size: 1.8rem;
      }
      &.active {
        background-color: var(--dropdown-hover);
        .assetName {
          color: var(--text-1);
        }
        .assetPrice {
          color: var(--text-1);
        }
      }
      &:hover {
        background-color: var(--dropdown-hover);
        color: var(--text-1);
      }
    }
  }
  .light-background {
    background-color: var(--dropdown-hover);
  }
`;

export { Background };

import styled from 'styled-components';

const Background = styled.div`
  grid-area: Content;
  /* max-width: 1100px; */
  width: 100%;
  height: 62vh;
  margin: 0rem auto;
  padding: 0rem var(--global-padding);
  /* margin-top: 1rem; */
  /* margin-bottom: 9rem; */
  .asset-dropdown {
    width: fit-content;
  }
  .small-up-down {
    width: 1rem;
    margin-right: 0.3rem;
    margin-top: 0.2rem;
  }

  .custom-wrappper {
    width: 100%;
    padding: 1.4rem;
    border-radius: 0.9rem;
  }
  /* margin-left: 12rem; */
  .asset-info-section {
  }
  div .tab-pannel- {
    margin-top: 0rem;
  }
  .chartButton {
    color: var(--text-1);
    background: inherit;
    border: 1.5px solid var(--bg-14);
    border-radius: 1rem;
    padding: 0.6rem 1rem;
    font-size: 1.4rem;
    text-transform: capitalize !important;
    svg {
      transform: scale(1.2);
      margin-right: 0.4rem;
    }
    @media (min-width: 1800px) {
      font-size: 1.2rem;
      padding: 0.6rem 0.8rem;
      font-size: 1.4rem;
      svg {
        transform: scale(1.4);
      }
    }
  }
  .head,
  .desc {
    margin: 0;
    font-weight: 400;
    font-size: 1.58rem;
    margin: 0.6rem 0;
  }
  .head {
    font-size: 1.5rem;
    color: var(--text-6);
  }
  .asset-grid {
    display: flex;
    align-items: flex-start;
    background-color: transparent;
    border-radius: 1.2rem;
    padding: 1rem;
    width: fit-content;
    /* grid-template-areas: "img ticker arrow" "img asset-name arrow"; */
    column-gap: 1.4rem;
    /* row-gap: 0.2rem; */
  }
  .asset-grid-image {
    width: 2.4rem;
    height: 3.2rem;
    object-fit: contain;
    border-radius: 50%;
  }
  .asset-grid-ticker {
    display: flex;
    align-items: center;
    font-size: 2rem;
    font-weight: 400;
  }
  .asset-grid-name {
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--bg-20);
  }

  .dropdown {
    padding: 1.2rem 2.3rem;
    background: transparent;
    max-width: 17rem;
    gap: 1rem;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    font-weight: 400;
    white-space: nowrap;
    color: var(--text-6);
  }
  .dropdown-item {
    width: 100%;
    font-family: Relative Pro;
    font-size: 1.5rem;
    font-weight: 400;
    text-align: left;
    text-transform: capitalize;
    color: var(--text-6);
    padding: 3px 1.5rem;

    :hover {
      background: var(--bg-14);
      color: var(--text-1);
    }
  }
  .dropdown-box > .dropdown-items {
    width: 100%;
    max-height: 20rem;
    overflow-y: auto;

    ::-webkit-scrollbar {
      width: 4px;
    }
  }
  .chain-container {
    display: flex;
    gap: 1rem;
    font-size: 1.3rem;
  }

  .root-items {
    width: 100% !important;
  }
  .item {
    width: 100%;
    padding: 0 2.3rem;
  }
  .chartButton {
    background-color: var(--bg-19);
    border: none;
  }
`;
const ActiveTabStyles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1.2rem;
  /* margin-bottom: 2rem; */
  .option {
    background-color: var(--bg-1);
    padding: 14px 20px;
    border-radius: 1rem;
    /* margin-bottom: 1rem; */
    @media (max-width: 380px) {
      padding: 14px;
    }
  }
  .predictbutton {
    font-size: 1.3rem;
    font-weight: 400;
  }
  .details-btn {
    background-color: #303044;
    padding: 4px;
    padding-left: 12px;
    border-radius: 6px;
    height: 30px;
    color: white;
    font-size: 1.4rem;
  }
`;
const BuyOptionsStyles = styled.div`
  @media only screen and (max-width: 1200px) {
    position: relative;
  }
`;

const NewBinaryStyles = styled.div`
  background-color: var(--bg-23);
  padding: 1.5rem;
  border-radius: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* flex-wrap: wrap; */

  .info-com {
    white-space: nowrap;
    padding: 0.5rem 1.5rem;

    /* :not(:last-of-type) {
      border-right: 1px solid var(--dropdown-hover);
    } */

    .chip {
      background-color: var(--bg-20);
      color: var(--primary);
      font-size: 1.2rem;
      font-weight: 600;
      padding: 0.2rem 1.3rem;
    }

    .assetImage {
      /* margin-top: -1rem; */
      margin-right: 0.8rem;
      --dim: 2.7rem;
      width: var(--dim);
      height: var(--dim);
      border-radius: 50%;
      @media (max-width: 1200px) {
        margin-right: 0.8rem;
      }
    }
  }
`;
export { Background, ActiveTabStyles, BuyOptionsStyles, NewBinaryStyles };

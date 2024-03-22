import styled from "styled-components";

const AssetCellLayout = styled.div`
  margin-bottom: var(--mb);
  span {
    @media screen and (max-width: 600px) {
      font-size: 13px;
    }
  }
`;

const CellDescLayout = styled.div`
  span {
    @media screen and (max-width: 600px) {
      font-size: 12px;
    }
  }
  .mobile-align {
    @media only screen and (max-width: 600px) {
      align-items: center;
    }
  }
`;

const TableLayout = styled.div`
  @media screen and (max-width: 600px) {
    .lift-up {
      .headText {
        font-family: "Relative Pro", sans-serif;
        justify-content: flex-start;
      }
    }
    .head-text {
      line-height: 24px;
      font-weight: 600;
      font-size: 13px;
    }
    .desc-text {
      line-height: 16px;
      font-size: 14px;
    }
    .primary-btn {
      font-size: 14px;
      line-height: 24px;
      font-family: "Relative Pro", sans-serif;
      padding: 6px 0;
      border-radius: 12px;
    }
    .secondary-btn {
      font-size: 14px;
      line-height: 24px;
      font-family: "Relative Pro", sans-serif;
      padding: 5px 0;
      border-radius: 12px;
    }
  }
`;

const Background = styled.div`
  .swap-padding {
    padding: 0 8px;
  }
  .asset-img-cell {
    top: 0.3rem;
  }

  .padding-right-table {
    padding-left: 1.6vw;
  }
  .action-button {
    padding: 0.5rem 2rem;
    font-size: 1.4rem;
    /* font-weight: 400; */
  }
  .buttons {
    width: max-content;
    gap: 8px;
    margin: auto;
  }
`;
export { AssetCellLayout, CellDescLayout, TableLayout, Background };

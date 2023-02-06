import styled from "@emotion/styled";

const Background = styled.div`
  position: relative;
  height: 60vh;
  overflow-y: auto;
  width: calc(100% + 6px);
  /* background-color:red; */
  overflow-x: hidden;
  &::-webkit-scrollbar {
    background: transparent;
    height: 7px;
    width: 4px;
  }
  @media only screen and (max-width: 600px) {
    margin-bottom: 2rem;
    /* margin-bottom: 10rem; */
    /* height: max-content; */
    /* overflow: unset;
    &::-webkit-scrollbar {
      width: 0px;
    } */
    &::-webkit-scrollbar {
      background: var(--bg-23-table-row);
      height: 2px;
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: var(--bg-23-table-row);
      /* background: transparent; */
    }
    &::-webkit-scrollbar-thumb {
      background: var(--bg-14-blue);
    }
  }
  .table-btn {
    font-family: Relative Pro;
    padding: 0rem 1rem;
    min-width: unset;
    border-radius: 5px;
    font-weight: 500;
    height: 2.2rem;
  }
  .lower-table {
    z-index: 0;
  }
  .loader {
    position: absolute;
    height: 7rem;
    width: 99%;
    z-index: -1;
    top: -300px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 0.8rem;

    @media only screen and (max-width: 600px) {
      /* top: -300px; */
      z-index: 2;
    }
  }
  .priceTracker {
    /* position: absolute; */
    top: 335px;
    width: 100%;
    z-index: 1;
    .content {
      position: relative;
      .line {
        content: "";
        height: 2px;
        background-color: var(--bg-14);
        width: 100%;
      }
      .tracker {
        position: absolute;
        top: -12px;
        right: 0px;
        left: 0px;
        margin: auto;
        background-color: var(--bg-14);
        width: fit-content;
        padding: 3px 10px;
        border-radius: 4px;
        color: var(--text-1);
        z-index: 1;
      }
    }
  }
`;
export { Background };

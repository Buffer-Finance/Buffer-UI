import styled from "styled-components";

const Background = styled.div`
  color: var(--text-1);
  font-size: 16px;
  margin-bottom: 2rem;

  .cell {
    margin-bottom: 1.5rem;
    /* box-shadow: var(--white-shadow); */
  }
  .body {
    background: var(--bg-23);
    border-radius: 1.6rem;
    padding: 2.8rem 1.8rem;
    padding-bottom: 2.6rem;
    /* box-shadow: var(--white-shadow); */

    // row-gap: 1.5rem;
  }
  .redirect {
    color: inherit;
    text-decoration: none;
  }
  .redirect:hover {
    text-decoration: underline;
  }
  .right-text {
    * {
      justify-content: flex-end;
    }
  }
  .highlight {
    font-weight: 600;
    color: var(--text-1);
  }
  .mtb {
    margin: 2rem 0 1rem 0;
  }
  .action {
    background: var(--bg-14);
    color: var(--text-1);
    border: none;
    border-radius: 1.2rem;
    padding: 1.1rem 1.8rem;
    text-transform: initial !important;
    font-size: 12px;

    &:hover {
      background: var(--bg-8);
    }
  }
  .details {
    text-transform: initial !important;
    font-size: 13px;
  }
  .cell2 {
    transition: height 0.2s ease-in-out;
  }
  .divider {
    border-color: var(--bg-14);
    width: 100%;
    margin-bottom: 1.5rem;
  }
  .h {
    height: 20rem;
    transform: none !important;
  }
  .rows {
    row-gap: 1.5rem;
  }
  .auto_close {
    font-size: 14px;
  }
  .btn {
    font-size: 16px;
    /* font-family: "Inter"; */
    padding: 0.3rem 1rem;
    min-width: auto;
    &:disabled {
      padding: 0.3rem 1rem;
    }
    &:active {
      font-size: initial;
      padding: 0.3rem 1rem;
    }
    &:hover {
      font-size: initial;
      padding: 0.3rem 1rem;
      transform: none;
    }
  }
  .status {
    margin: 1.5rem 0;
  }
  .highlight,
  .desc-text {
    font-size: 15px;
  }
  .error {
    color: var(--text-6);
    row-gap: 1.7rem;
  }
`;
export default Background;

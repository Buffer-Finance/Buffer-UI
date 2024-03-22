import styled from "styled-components";
import Button from "@mui/material/Button";

const Style = styled.div`
  /* background-color: var(--bg-19); */
  width: 1.9rem;
  height: 4rem;
  padding: 0.8rem 1.3rem;
  width: max-content;
  border-radius: 1.2rem;
  @media (min-width: 600px) {
    margin-left: 1.3rem;
  }
  .walletIcon {
    margin-right: 0.9rem;
  }
  .balanceText {
    font-size: 1.5rem;
    color: var(--text-1);
    /* margin-right: 1.6rem; */
  }
  .tier {
    background-color: var(--bg-20);
    border-radius: 0.5rem !important;
    color: var(--primary);
    width: 5rem !important;
    height: 2.2rem;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0 !important;
    min-width: 5rem !important;
    text-transform: none;
    &:hover {
      background-color: var(--bg-20);
    }
  }
  @media only screen and (max-width: 600px) {
    height: fit-content;
    .balanceText {
      font-size: 1.4rem;
    }
    padding: 0.6rem 1.3rem 0.5rem 0.8rem;
    border: 0.1rem solid var(--primary);
    border-radius: 0.8rem;
  }
`;

export default Style;

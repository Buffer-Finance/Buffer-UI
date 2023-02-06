import styled from "styled-components";
import Button from "@mui/material/Button";

const StyledButton = styled(Button)`
  /* background-color: var(--primary); */
  font-family: Relative Pro;
  border-radius: 1rem;
  color: var(--primary);
  font-size: 1.5rem;
  padding: 0.7rem 1.5rem;
  text-transform: initial !important;
  transition: 100ms;
  height: 4.1rem;
  transform: translateY(0%);
  &:hover {
    transform: translateY(-5%);
    box-shadow: 0 0.3rem 1rem 0 rgba(0, 0, 0, 0.1);
  }
  &:active {
    transform: translateY(0%) !important;
  }
  &:disabled {
    padding: 0.9rem 1.7rem;
    background-color: var(--bg-19);
    border-radius: 1.2rem;
    font-weight: 500;
    height: 4.1rem;

    color: var(--text-6) !important;
    font-size: 1.56rem;
    text-transform: capitalize !important;
    /* border: 1.5px solid var(--disabled-button); */
    /* border: 1.5px solid var(--bg-14); */
    cursor: not-allowed;
  }
`;

export default StyledButton;

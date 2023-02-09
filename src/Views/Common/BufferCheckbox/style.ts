import styled from "styled-components";

const Background = styled.div`
  width: fit-content;
  align-self: center;
  display: flex;
  align-items: center;
  cursor: pointer;

  .checkboxborder {
    border-radius: 4px;
    border: 2px solid var(--primary);
    display: grid;
    place-items: center;
    &.active__background {
      background-color: var(--primary);
    }
    &.disabled {
      background-color: #303044;
      border: 2px solid #303044;
    }
    .checkbox__filled {
      stroke-dasharray: 100;
      stroke-dashoffset: 126;
      transition: 400ms cubic-bezier(0.075, 0.82, 0.165, 1);
      &.active {
        stroke-dashoffset: 80;
        stroke: var(--text-1);
      }
    }
  }
`;
export default Background;

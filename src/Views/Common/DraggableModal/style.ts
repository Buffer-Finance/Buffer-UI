import styled from "@emotion/styled";

const Background = styled.div`
  padding: 3rem;
  background-color: var(--bg-19);
  width: fit-content;
  height: fit-content;
  position: fixed;
  bottom: 3rem;
  right: 2rem;
  margin-top: 15px;
  margin-right: 15px;
  z-index: 950;
  border-radius: 12px;
  box-shadow: 0 0 0.1px 0.5px var(--bg-14);
  /* border: 1px solid var(--bg-14); */
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  &:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }

  .close {
    position: absolute;
    right: 22px;
    top: -15px;
    color: var(--text-1);
    background-color: var(--bg-14);
    border-radius: 50%;
  }
`;

export { Background };

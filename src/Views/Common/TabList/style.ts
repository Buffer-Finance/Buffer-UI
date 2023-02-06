import styled from "styled-components";

const Background = styled.div`
  --border-radius: 1rem;
  display: flex;
  width: fit-content;
  border-radius: var(--border-radius);
  background-color: var(--bg-19);
  border-radius: var(--border-radius);
  overflow-y: hidden;
  .toggle-tab {
    padding: 0.7rem 1.5rem;
    margin: 0 0.1rem;
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--text-1);
    transition: 0.2s ease;
    &.active {
      /* font-weight: 500; */
      background-color: var(--primary);
    }
    &:hover {
      color: var(--text-1);
    }
  }
`;
export default Background;

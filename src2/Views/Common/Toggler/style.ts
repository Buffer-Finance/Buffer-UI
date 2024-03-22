import styled from "styled-components";

const Background = styled.div`
  --border-radius: 0.43rem;
  display: flex;
  .toggle-tab {
    padding: 0.8rem 1.5rem;
    margin: 0 0.1rem;
    cursor: pointer;
    font-size: 1.3rem;
    font-weight: 500;
    background-color: var(--bg-19);
    color: var(--text-6);
    &.active {
      background-color: var(--bg-14);
      color: var(--text-1);
    }
    &:hover {
      color: var(--text-1);
    }
    &:first-of-type {
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
      margin-left: 0;
    }
    &:last-of-type {
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
      margin-right: 0;
    }
  }
`;
export default Background;

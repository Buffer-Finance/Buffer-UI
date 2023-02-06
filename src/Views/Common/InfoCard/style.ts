import styled from "styled-components";

const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* padding: 1.7rem 0; */
  width: 100%;
  /* background-color: var(--bg-23-table-row); */
  border-radius: 1.2rem;
  transition: transform 200ms ease;
  &:hover {
    transform: scale(1.05);
  }
`;
export default Background;

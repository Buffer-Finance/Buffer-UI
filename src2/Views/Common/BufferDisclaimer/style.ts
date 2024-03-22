import styled from "styled-components";

const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-19);
  border-radius: 1.3rem;
  padding: 1.2rem 1.5rem;
  color: var(--text-1);
  font-size: 1.4rem;
  margin: 2rem 0;
  width: fit-content;
  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
  .first-part {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .button {
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export default Background;

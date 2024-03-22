import styled from "styled-components";

const Background = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 2.5rem;
  padding: 1rem 0;
  padding-bottom: 2rem;
  font-family: Relative Pro;
  .button {
    width: fit-content;
    font-size: 1.4rem;
    padding: 0.6rem 1.4rem;
    font-family: Relative Pro;
    &:hover {
      width: fit-content;
      font-size: 1.4rem;
      padding: 0.6rem 1.4rem;
    }
  }
`;
export default Background;

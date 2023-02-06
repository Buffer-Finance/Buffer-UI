import styled from "styled-components";

const Style = styled.div`
  display: none;
  @media only screen and (max-width: 600px) {
    width: 100%;
    position: fixed;
    backdrop-filter: blur(12px);
    bottom: 0;
    padding-bottom: 0.2rem;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 1rem;
    align-items: center;
    .padding {
      margin-right: 1rem;
    }
  }
`;
export default Style;

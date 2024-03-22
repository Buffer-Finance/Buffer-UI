import styled from "styled-components";

const Background = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 77vh;
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : "0px")};
  .missing-img {
    margin-bottom: 2rem;
    width: 17rem;
  }
  .text {
    padding: 0 3rem;
    font-size: 1.7rem;
    font-weight: 400;
    margin-bottom: 2rem;
    text-align: center;
    max-width: 47rem;
  }
`;
export default Background;

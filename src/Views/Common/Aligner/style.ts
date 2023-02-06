import styled from "styled-components";

const Background = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .key {
    /* font-family: Relative Pro; */
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--text-v1);
    margin-bottom: 2px;
    &:after {
      content: "\00a0";
    }
  }
  .value {
    margin-bottom: 2px;
    font-weight: 500;
    font-size: 1.4rem;
    color: var(--text-v1);
  }
`;
export default Background;

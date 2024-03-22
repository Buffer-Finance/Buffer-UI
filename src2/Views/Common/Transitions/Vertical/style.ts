import styled from "styled-components";

const Background = styled.div`
  transition: 500ms ease;
  &.in {
    max-height: 200px;
  }
  &.out {
    max-height: 2px;
  }
`;
export default Background;

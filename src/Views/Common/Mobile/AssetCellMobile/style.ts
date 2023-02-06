import styled from "styled-components";

const Layout = styled.div`
  margin-bottom: var(--s);
  .text12px {
    font-size: 14px;
  }
  .imgs-row {
    display: flex;
    .upper-img {
      height: 30px;
      width: 30px;
      z-index: 1;
    }
    .lower-img {
      height: 30px;
      width: 30px;
      position: relative;
      transform: translateX(12px);
    }
  }
  .headText {
    font-size: 16px;
    font-weight: 600;
    line-height: 17.18px;
    color: var(--text-1);
    /* font-family: "Inter", sans-serif; */
  }
  .descText {
    /* font-family: "Inter", sans-serif; */
    font-size: 16px;
    font-weight: 500;
    color: var(--text-6);
    span {
      white-space: nowrap;
    }
  }
`;

export default Layout;

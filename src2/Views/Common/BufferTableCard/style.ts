import styled from "styled-components";

const Background = styled.div`
  .tableCardSkeleton {
    background-color: var(--bg-8);
    width: 100%;
    height: 260px;
    border-radius: 19.33px;
    transform: translateY(0px);
  }
`;

const Card = styled.div`
  margin: 16px 0;
  width: 100%;
  padding: 21px 24px;
  background-color: var(--bg-19);
  border-radius: 19.33px;
  font-size: 12px !important;

  .title {
    color: var(--text-1);
    /* font-family: "Relative Pro", sans-serif !important; */
    .title-value {
      font-size: 28px;
      font-weight: 500;
    }
    .title-name {
      font-size: 14px;
      font-weight: 400;
    }
  }
`;

export default Card;
export { Background };

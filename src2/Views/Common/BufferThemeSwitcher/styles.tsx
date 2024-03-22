import styled from "@emotion/styled";

const Background = styled.div`
  width: fit-content;
  position: relative;
  .theme-switcher {
    width: 58px;
    height: 26px;

    cursor: pointer;
    margin: 0 auto;

    .background {
      width: 58px;
      height: 26px;
      background-color: var(--bg-14);
      border-radius: 13px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .theme-switcher-image {
      margin: 0px 5px;
      /* height: 30px;
      width: 30px; */
      z-index: 0;
      color: white;
      transition: all 0.2s ease-in-out;

      .moon {
        fill: white;
      }
    }
    .switch {
      /* box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); */
      height: 18px;
      width: 18px;
      background-color: var(--primary);
      position: absolute;
      top: 3.7px;
      left: 5px;
      border-radius: 50%;
      transition: all 0.2s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    input {
      display: none;
      &:checked + .switch {
        left: 35px;
      }
    }
  }
`;
export { Background };

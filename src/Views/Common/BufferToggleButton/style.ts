import styled from "@emotion/styled";

const Background = styled.div`
  width: fit-content;
  position: relative;
  .theme-switcher {
    cursor: pointer;
    margin: 0 auto;

    .background {
      width: 104px;
      height: 27px;
      background-color: var(--bg-14);
      border-radius: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .theme-switcher-image {
      margin: 0px 5px;
      /* height: 30px;
      width: 30px; */
      z-index: 1;
      color: white;
      transition: all 0.2s ease-in-out;
      font-family: Relative Pro;
      font-size: 1.4rem;
      font-weight: 500;
      text-align: center;
    }
    .switch {
      /* box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); */
      width: 52px;
      height: 27px;
      background-color: var(--primary);
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 0.7rem;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      transition: all 0.2s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    input {
      display: none;
      &:checked + .switch {
        left: 52px;
        border-radius: 0.7rem;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
`;
export { Background };

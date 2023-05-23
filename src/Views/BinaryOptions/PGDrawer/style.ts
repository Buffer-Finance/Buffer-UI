import styled from '@emotion/styled';

const Background = styled.div`
  background-color: var(--bg-0);
  color: var(--text-6);
  .marketTxt {
    display: inline;
    font-size: 1.9rem;
    color: var(--text-1);
    font-weight: 500;
  }
  .custom-h {
    height: 35px;
  }
  .blue-link {
    /* color:var(--bg-21); */
    font-size: 1.2rem;
    /* margin-top:0.4rem; */
    font-weight: 500;
    text-decoration: underline;
    cursor: pointer;
  }
  .link {
    cursor: hover;
    color: var(--bg-20);
    font-size: 1.2rem;
    text-decoration: underline;

    @media only screen and (min-width: 1700px) {
      font-size: 1.4rem;
    }
    svg {
      transform: scale(0.7);
      transform-origin: bottom;
      margin-right: 0.2rem;
    }

    a {
      margin-top: -0.2rem;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  div.approve-btn-styles {
    background-color: transparent;
    /* border: 1px solid var(--primary); */
    font-size: 1.3rem;
    text-decoration: underline;
    cursor: pointer;
    text-align: center;
    /* color: white; */
    font-weight: 400;
    /* &:disabled {
      cursor: not-allowed;
      border: none;
    } */

    /* &:hover {
      background-color: var(--time-selector-bg);
    } */
  }

  .alignerGap {
    gap: 1rem;
  }
  .custom-wrapper {
    width: 100%;
    /* padding: 1.4rem 0; */
    border-radius: 0.9rem;
    /* background-color: var(--bg-23); */
    display: flex;
    flex-direction: column;
    .head {
      font-size: 1.4rem;
      color: var(--text-6);
      margin: 0;
    }
    .value {
      color: var(--text-1);
    }
  }
  .btn-wrapper {
    display: flex;
    width: 100%;
    column-gap: 1rem;
  }
  .btn {
    width: 100%;
    background-color: #303044;
    font-weight: 600;
    color: #ff5353;
    font-size: 1.6rem;
    border-radius: 1rem;
    font-weight: 700;

    svg {
      margin-right: 0.3rem;
    }
    &.up {
      color: var(--green);

      &:hover {
        background-color: #3fb68b;
        color: #ffffff;
      }
    }
    &:hover {
      background-color: #ff5353;
      color: #ffffff;
    }
  }
  .duration-container {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    /* border-radius: 0.4rem; */
    .each-duration {
      cursor: pointer;
      /* width: 100%; */
      font-size: 14px;
      text-align: center;
      border-radius: 6px;
      padding: 6px 8.55px;
      border: 1px solid transparent;

      background: var(--bg-1);
      &.active {
        background: var(--bg-0);
        border: 1px solid #a3e3ff;
      }
    }
  }
`;

const DateDropDownStyles = styled.div`
  .datedropdown {
    padding: 1.2rem 2.3rem;
    background: var(--bg-23);
    /* max-width: 17rem; */
    gap: 1rem;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    font-weight: 500;
    white-space: nowrap;
    background-color: var(--bg19-white);
    @media (max-width: 1200px) {
      padding: 0.8rem 1.6rem;
    }
  }

  .active {
    color: var(--text-1);
  }
  .dropdown-box > .dropdown-items {
    width: 100% !important;
  }

  .dateitem {
    font-family: Relative Pro;
    font-size: 1.3rem;
    font-weight: 500;
    /* text-transform: capitalize; */
    padding: 0.8rem 1.5rem;
    color: var(--text-6);
    /* padding-left: 2rem; */

    :not(:first-of-type) {
      /* margin-top: 0.2rem; */
    }
    :hover,
    .activeButton {
      background-color: var(--bg-14);
      color: var(--text-1);
    }
  }
`;

const MobileBackground = styled.div`
  .btn-skels {
    width: 100%;
    height: 4rem;
    border-radius: 1.3rem;
  }
  .stat-skel {
    border-radius: 1.3rem;
    margin: 1rem 0;
    width: 100%;
    height: 6rem;
  }
  .btn-container {
    display: flex;
    column-gap: 1rem;
  }
  /* .theme-switcher {
    .background {
      width: 60px;
      height: 20px;
    }
    .background > .theme-switcher-image {
      font-size: 1.1rem;
    }
    .switch {
      width: 33px;
      height: 19px;
    }
    input {
      &:checked + .switch {
        left: 29px;
      }
    }
  } */
  .link {
    margin-top: 1rem;
    cursor: hover;
    color: var(--bg-20);
    font-size: 1.2rem;
    text-decoration: underline;

    @media only screen and (min-width: 1700px) {
      font-size: 1.4rem;
    }
    svg {
      transform: scale(0.7);
      transform-origin: bottom;
      margin-right: 0.2rem;
    }

    a {
      margin-top: -0.2rem;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .lower-part {
    .inputStyle {
      font-size: 1.3rem;
    }
  }
`;
export { Background, DateDropDownStyles, MobileBackground };

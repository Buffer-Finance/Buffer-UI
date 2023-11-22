import styled from 'styled-components';

const Style = styled.div`
  height: 4rem;
  .chain-dropdown-box {
    padding: 0rem !important;
    width: 100% !important;
    height: 4rem;
  }
  .primaryBtn {
    display: flex;
    border-radius: 1rem;
    color: var(--text-1);
    /* min-width: 15rem; */
    /* border: 0.1rem solid var(--primary); */
    padding: 0.95rem 1.3rem;
    color: var(--text-v1);
    height: 100%;
    background: var(--bg-19);
    @media (max-width: 600px) {
      padding: 0.4rem 1rem 0.4rem 0.8rem;
      /* padding-bottom: 0.4rem; */
    }
  }
  /* .autoMar {
    margin: auto 0;
  } */

  .dropdown {
    position: relative;
    /* height: 48.08px; */
  }
  .fullWidth {
    color: var(--text-v1);
    /* font-family: Relative Pro !important; */
    position: relative;
  }
  .date {
    text-transform: none;
    font-weight: 300;
    font-size: 15px;
  }

  .period {
    background-color: transparent !important;
    color: var(--text-v1) !important;
    height: 49.08px;
    outline: none;
    padding: 1em;
    border-radius: 9.06925px !important;
    border: 1px solid !important;
    justify-content: space-between !important;
    width: 100%;
    border-color: $primaryColor !important;
    /* font-family: Relative Pro !important; */
    text-transform: capitalize !important;
    padding-left: 1em !important;
    input {
      color: var(--text-v1);
      background-color: transparent !important;
    }
    .primaryBtn {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    span {
      font-size: 1.5rem;
    }
  }
  /* .position {
    font-size: 2rem;
    fill: var(--text-1) !important;
    transition: 100ms ease;
    transform: rotateZ(0deg);
    &.rotate {
      transform: rotateZ(180deg);
    }
    @media screen and (max-width: 600px) {
      font-size: 2.5rem;
      margin-left: 5px;
    }
  } */
  .filled {
    background: linear-gradient(
      180deg,
      #00b3e3 27%,
      #00c4df 39.12%,
      #00dacf 59.16%
    ) !important;
    color: $secondaryColor !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    justify-content: center !important;
    text-align: center;
    @media screen and (max-width: 1024px) {
      min-width: 0 !important;
    }
    span {
      font-size: 1.5rem;
    }
  }
  .outer {
    background-image: linear-gradient(180deg, #9d37ad 0%, #5b39e1 100%);
    border-radius: 8.19185px;
    padding: 1px;
    border-radius: 11.1602px !important;
    position: relative;
    .period {
      border: none !important;
      border-radius: 11.1602px !important;
      height: 46px;
    }
    @media screen and (max-width: 600px) {
      // margin: 0 0 3em 0;
      width: 100%;
    }
  }
  .inner {
    border-radius: 8.19185px !important;
    background-color: var(--bg-farm) !important;
    border-radius: 11.1602px !important;
    height: 100%;
  }
  .dropdown_menu {
    // left: 0;
    width: 100%;
    perspective: 1000px;
    color: var(--text-v1);
    background-color: var(--skel-back);
    z-index: 300;
    // display: none;
    border-bottom-left-radius: 9.06925px !important;
    border-bottom-right-radius: 9.06925px !important;
  }
  .dropdown_menu_nav {
    position: absolute;
    top: 100%;
    left: 0%;
    // left: 0;
    width: 100%;
    perspective: 1000px;
    color: var(--text-v1);
    background-color: var(--bg-19);
    z-index: 300;
    // display: none;
    border-bottom-left-radius: 9.06925px !important;
    border-bottom-right-radius: 9.06925px !important;
    @media (max-width: 600px) {
      top: 0%;
      z-index: -1;
      border-radius: 0;
      transform: translateY(-95%);
      border-top-left-radius: 9.06925px !important;
      border-top-right-radius: 9.06925px !important;
    }
  }
  .dropdown_item {
    color: var(--text-v1) !important;
    /* font-family: Relative Pro !important; */
    padding: 1em !important;
    text-transform: capitalize !important;
    z-index: 300;
    justify-content: center !important;
    z-index: 2000;
    width: 100%;
    @media (max-width: 600px) {
      padding-right: 1rem !important;
      padding-left: 1rem !important;
    }
  }
  .dropdown_item2 {
    color: var(--text-6);
    font-size: 1.4rem;
    padding: 0.7em 1.5em;
    text-transform: capitalize;
    background-color: var(--bg-19);
    justify-content: flex-start;
    z-index: 2000;
    width: 100%;
    .disconnectImg {
      margin-right: 1.1rem;
      font-weight: 600;
    }
    span {
      font-size: 1.4rem;
    }
    &:hover {
      color: var(--text-1);
    }
    @media (max-width: 600px) {
      justify-content: center;
    }
  }
  .fullWidth {
    .dropdown_item {
      justify-content: flex-start !important;
      font-size: 1.4rem;
      padding: 0rem;
      padding: 0.6rem 1rem !important;
    }
  }
  .dropdown_menu_6 {
    // animation: growDown 500ms ease-in-out forwards;
    transform-origin: top center;
    position: absolute !important;
    width: fit-content;
    transition-delay: 10s;
    transition: transform 10s;
    border-bottom-left-radius: 9.06925px !important;
    box-shadow: 1px 1px 5px 1px rgb(0 0 0 / 25%);
    border-bottom-right-radius: 9.06925px !important;
  }
  .nav_drop {
    // animation: growDown 500ms ease-in-out forwards;
    transform-origin: top center;
    position: absolute !important;
    top: 45px;
    width: auto;
    left: 7%;
    right: 1em;
    padding: 0 3em;
    transition-delay: 10s;
    transition: transform 10s;
    border-bottom-left-radius: 9.06925px !important;
    border-bottom-right-radius: 9.06925px !important;
    @media (max-width: 600px) {
      top: -53%;
      // right: 0em;
      display: flex;
      border-radius: 0 !important;
      border-top-left-radius: 9.06925px !important;
      border-top-right-radius: 9.06925px !important;
      // transform: translateY(-100%);
    }
  }

  .source {
    margin: 10px 0;
    .dropdown_menu {
      max-height: 150px;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        background: var(--bg-color);
        height: 7px;
        width: 0.5vw;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 24px;
        background: #8b8b8b24;
        opacity: 0.1;
      }

      &::-webkit-scrollbar-track {
        border-radius: 24px;
        background: var(--skel-back);
      }
    }
  }
  .foot {
    float: right;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 172.5%;
    text-align: center;
    color: var(--text-v1);
    opacity: 0.9;
    margin-top: 8px;
    .balance {
      display: flex;
      justify-content: flex-end;
    }
  }
  .warning {
    * {
      color: #ffffff91 !important;
    }
    span {
      margin-left: 5px;
    }
  }
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .connect {
    display: flex;
  }
  /* .txt { */
  /* font-size: 1.4rem; */
  /* margin: 0 8px 0 10px; */
  /* height: 2.1rem; */

  /* @media (max-width: 600px) {
      margin: auto;
    }
  } */
  .nav {
    margin: auto;
    justify-content: flex-end;
    height: max-content;
    //   flex-direction: column;
  }

  .walletImage {
    @media (max-width: 600px) {
      margin-right: 10px !important;
    }
  }
  .primaryBtn-connect-wrong {
    align-items: center;
    .cls {
      margin: auto;
      display: flex;
      @media (max-width: 600px) {
        margin: auto;
      }
    }
    .txt {
      margin-right: 0;
    }
  }
  @media (max-width: 600px) {
    transform: scale(0.9);
    .dropdown-items {
      transform: translateX(-50%) scale(1) translateY(-250%) !important;
    }
    .primaryBtn-connect {
      min-width: unset;
    }
    .primaryBtn-connect-wrong {
      min-width: unset;
    }
  }
  .drawer-dropdown {
    @media (max-width: 600px) {
      transform: translateX(-50%) scale(1) translateY(8%) !important;
    }
  }
`;
export default Style;

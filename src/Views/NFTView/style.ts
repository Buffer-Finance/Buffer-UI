import styled from '@emotion/styled';

const Background = styled.div`
  color: var(--text-1);
  margin: 4rem 0;
  .header {
    font-size: 3rem;
    font-weight: 400;
    position: relative;

    @media only screen and (max-width: 600px) {
      font-size: 1.8rem;
    }

    ::after {
      position: absolute;
      content: '';
      background: linear-gradient(0deg, #3772ff, #3772ff),
        linear-gradient(180deg, #0cebeb 0%, #20e3b2 44.06%, #29ffc6 100%);
      bottom: -8px;
      height: 1.25px;
      width: calc(100% - 20px);
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }
  .wrapper {
    display: flex;
    gap: 40px;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap;
  }
  .center {
    display: grid;
    column-gap: 6rem;
    row-gap: 5rem;
    justify-content: center;
    font-size: 1.3rem;

    @media screen and (min-width: 30em) {
      grid-template-columns: repeat(2, minmax(0px, 1fr));
    }
    @media screen and (min-width: 48em) {
      grid-template-columns: repeat(3, minmax(0px, 1fr));
    }
    @media screen and (min-width: 62em) {
      grid-template-columns: repeat(4, minmax(0px, 1fr));
    }
    @media screen and (min-width: 80em) {
      grid-template-columns: repeat(5, minmax(0px, 1fr));
    }
    @media screen and (min-width: 100em) {
      grid-template-columns: repeat(6, minmax(0px, 1fr));
    }
    @media screen and (min-width: 120em) {
      grid-template-columns: repeat(6, minmax(0px, 1fr));
    }
  }
  .image {
    position: relative;
    overflow: hidden;
    border-radius: 14.0123px;

    :hover {
      cursor: pointer;
      .foreground {
        transform: scale(1.09);
      }
      .trade {
        opacity: 1;
      }
    }
  }

  .trade {
    opacity: 0;
    transition: all 0.3s ease-in-out;
    position: absolute;
    right: 11px;
    bottom: 16px;
  }
  .foreground {
    transition: all 0.3s ease-in-out;
    position: absolute;
    left: 0;
    right: 0;
    margin-right: auto;
    margin-left: auto;
    top: 39px;
  }
  .diamond {
    /* top: 5px; */
    /* right: 0px; */
    width: auto;
    height: 150px;
  }
  .gold {
    top: 35px;
    right: 25px;
    width: 145px;
    height: 145px;
  }
  .silver {
    top: 50px;
    right: 10px;
    width: 120px;
    height: 120px;
  }
  .platinum {
    /* top: 40px; */
    width: auto;
    height: 135px;
  }
  .background {
    width: 220px;
    height: 220px;
  }
  .nftcard {
    all: unset;
    position: relative;
    width: max-content;
    align-items: flex-start;
    /* ::after {
      position: absolute;
      content: "";
      background: #2a2a38;
      bottom: -10px;
      height: 1px;
      width: calc(100% - 5px);
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
    } */
  }

  .desc {
    max-width: 220px;
    /* word-break: break-all; */
    white-space: initial;
  }
  .type {
    text-transform: capitalize;
  }
`;
export { Background };

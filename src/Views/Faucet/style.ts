import styled from '@emotion/styled';

const Background = styled.div`
  /* background-image: url("/BG.png");
  background-position: 0% 10%;
  background-size: 100% 100%;
  background-repeat: no-repeat; */
  .wrapper {
    /* width: 100%; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 2.5rem;
    width: fit-content;
    @media (max-width: 600px) {
      flex-direction: column;
      padding: 0 1rem;
      padding-top: 1rem;
    }
    .custom-loader {
      width: 50rem;
      height: 20rem;
    }
    .faucet-card {
      width: 100%;
      padding: 4rem;
      display: flex;
      flex-direction: column;
      row-gap: 2.5rem;
      align-items: center;
      justify-content: center;
      border-radius: 2.5rem;

      @media (max-width: 600px) {
        flex-direction: column;
        padding: 2rem;
      }
      .card-head {
        font-weight: 500;
        font-size: 2.4rem;
        color: var(--bg-20);
      }
      .card-middle {
        color: var(--text-6);
        font-size: 1.6rem;
        @media (max-width: 600px) {
          text-align: center;
        }
        /* font-weight: 500; */
      }
      .card-action {
        color: white;
        font-size: 1.8rem;
        a {
          color: white;
          text-decoration: underline;
          &:hover {
            color: var(--bg-20);
          }
        }
      }
    }
  }
  .root-ip-class {
    .ip-class {
      min-width: 40rem;
      padding: 1.1rem 1.8rem !important;
      background-color: var(--bg-19) !important;

      @media only screen and (max-width: 600px) {
        min-width: 100%;
      }
    }
  }
  .wrapper {
    margin: auto;
    margin-top: 6rem;

    display: flex;
    /* width: 100%; */
    /* justify-content: center; */
    /* column-gap: 1.4rem; */
    @media only screen and (max-width: 600px) {
      flex-direction: column;
      row-gap: 3rem;
      margin-top: 0;
    }
  }
  .btn {
    /* width: 20rem; */
    width: 15rem;
    border-radius: 1.4rem;
  }
`;
export default Background;

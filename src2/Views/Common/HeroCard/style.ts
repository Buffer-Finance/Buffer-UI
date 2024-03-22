import styled from "styled-components";

const Background = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  padding: 1.7rem 0rem 2.4rem;
  /* margin-bottom: 2.1rem; */
  /* background-color: var(--bg19-white); */
  border-radius: 1.2rem;
  box-shadow: var(--white-shadow);
  /* gap: 0.6rem; */

  /* @media only screen and (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  @media only screen and (max-width: 600px) {
    padding: 1.7rem 2rem;
    border-radius: 1.7rem;
    margin-bottom: 1rem;
  } */

  .page-name {
    font-size: 2.8rem;
    font-weight: 500;
    /* margin-bottom: 0.5rem; */
  }
  .title-text {
    font-size: 3.2rem;
    font-weight: 500;
    color: var(--bg-20);
    /* margin-bottom: 0.5rem; */
    /* @media screen and (max-width: 600px) {
      font-size: 2rem;
    } */
  }
  .title-text-skeleton {
    height: 48px;
    width: 161px;
    border-radius: 1.2rem;
    @media screen and (max-width: 600px) {
      height: 30px;
      width: 101px;
    }
  }
  .desc-text {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--text-6);
    margin-bottom: 0.5rem;
    /* @media only screen and (max-width: 600px) {
      font-size: 1.2rem;
    } */
  }
`;
export default Background;

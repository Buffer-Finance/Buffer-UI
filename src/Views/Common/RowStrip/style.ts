import styled from "styled-components";

const Background = styled.div`
  display: flex;
  .each-col {
    flex: 1;
    padding: 1.6rem 0;
    background-color: var(--bg-23);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:first-of-type {
      padding-left: 1rem;
      padding-right: 1rem;
      border-radius: 1.5rem 0px 0px 1.22rem;
      background-color: var(--bg-19);
    }
    &:last-of-type {
      border-radius: 0px 1.5rem 1.22rem 0px;
    }
  }
  .head {
    font-size: 1.4rem;
    font-weight: 500;
    /* font-family: Relative Pro; */
    color: var(--text-6);
    text-align: center;
  }
  .val {
    margin-top: 0.4rem;
    font-size: 1.6rem;
    text-align: center;
    font-weight: 400;
    /* font-family: Relative Pro; */
    color: var(--text-1);
  }
  .asset-img {
    --dim: 2.8rem;
    width: var(--dim);
    height: var(--dim);
    border-radius: 50%;
    object-fit: contain;
  }
  .left {
    margin-right: 1.5rem;
  }
  .asset-name {
    color: var(--text-1);
    margin: 0px;
    font-size: 1.6rem;
    font-weight: 600;
  }
  .pool-name {
    color: var(--text-1);
    margin: 0px;
    font-size: 1.3rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }
`;
export default Background;

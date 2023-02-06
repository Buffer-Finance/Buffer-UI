import styled from "styled-components";

const Background = styled.div`
  background-color: var(--bg-23);
  box-shadow: var(--white-shadow);
  color: var(--text-1);
  flex-wrap: wrap;
  width: 49%;
  padding: 2.1rem 2.6rem;
  border-radius: 1.7rem;
  transition: transform 200ms ease;
  @media (max-width: 600px) {
    width: 100%;
  }
  &:hover {
    transform: scale(1.03);
  }
  h2 {
    margin: 0;
    font-weight: 400;
    font-size: 1.5rem;
    /* font-family: Relative Pro; */
  }
  ul {
    color: var(--text-6);
    line-height: 2.4rem;
    font-size: 1.4rem;
    font-weight: 400;
    padding-left: 1.6rem;
    margin-top: 1.2rem;
  }
  a {
    color: var(--primary);
  }
`;
export default Background;

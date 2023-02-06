import styled from 'styled-components'

const Background = styled.div`
  z-index: 1300;
  background-color: var(--primary);
  display: grid;
  position: fixed;
  width: 100%;
  padding: 0.2rem;
  top: 0;
  font-size: 1.38rem;
  color: #ffffff;
  font-weight: 500;
  place-items: center;
  line-height: 2.8rem;
  max-height: 2.8rem;

  /* REMOVE THIS!!! */
  @media only screen and (max-width: 600px){
    display:none;
  }
  a {
    display: contents;
    color: inherit;
    text-decoration: none;
  }
  @media screen and (max-width: 600px) {
    display: none;
  }
`
export default Background

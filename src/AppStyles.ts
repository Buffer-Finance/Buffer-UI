import styled from '@emotion/styled';

const Background = styled.div`
  margin: 0;
  padding: 0;
  max-height: 100vh;
  z-index: 100;
  overflow-x: hidden !important;
  background-color: var(--bg-0);
  overflow-x: hidden;
  display: grid;
  grid-template:
    'Notification'
    'Header' auto
    'Main' 1fr
    'Footer' auto / 100%;
  height: 100vh;
  @media (max-width: 800px) {
    margin-bottom: 50px;
  }
  .root {
    grid-area: Main;
    /* overflow: auto; */
    display: flex;
    @media (max-width: 800px) {
      flex-direction: column;
    }
  }
  & .radius-0 {
    border-radius: 0px;
  }

  & .disclaimer {
    justify-content: center;
    border-radius: 0px;
    padding: 8px;
    margin: 0;
    width: 100%;
    font-size: 12px;
    text-align: left;
    /* color: #c3c2d4; */
    @media (max-width: 600px) {
      font-size: 10px;
    }
  }

  header {
    grid-area: Header;
  }
  footer {
    grid-area: Footer;
  }
`;
export default Background;

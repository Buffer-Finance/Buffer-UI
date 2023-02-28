import styled from 'styled-components';

const Background = styled.div`
  /* margin-top: -5px; */
  .indicator-style {
    background: ${(props) => props.indicatorColor || 'var(--primary)'};
    transform: translateY(
      ${(props) => '-' + (props.distance ? props.distance + 'px' : '0px')}
    );
    left: 0;
  }
  .root-button {
    font-family: Relative Pro;
    letter-spacing: 0ch;
    color: var(--text-6);
    /* font-size: 1.5rem; */
    font-weight: 500;
    padding: 0;
    margin: 0 3rem 0 0;
    text-transform: none;
    min-width: unset;
    transform: ${(props) =>
      props.moveY ? 'translateY(' + props.moveY + '%)' : 'translateY(0px)'};
    &:hover {
      color: var(--text-1);
    }
    @media (min-width: 1800px) {
      /* font-size: 1.8rem; */
    }
    @media only screen and (max-width: 1200px) {
      /* font-size: 15px; */
      margin-right: 5vw;
    }
  }
  .selected-button {
    color: ${(props) => props.activeTabColor || 'var(--text-1)'} !important;
    transform: ${(props) =>
      props.moveY ? 'translateY(' + props.moveY + '%)' : 'translateY(0px)'};
  }
  .tabs-root {
    margin-top: ${(props) => (props.moveY ? '-' + props.moveY + 'px' : '0px')};

    @media (max-width: 1200px) {
      /* margin-top: ${(props) =>
        props.moveY ? '-' + props.moveY * 2 + 'px' : '8px'}; */
    }

    & ::-webkit-scrollbar {
      background: var(--bg-grey);
      height: 0px;
      width: 7px;
    }
  }
`;

export default Background;

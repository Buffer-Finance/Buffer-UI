import styled from 'styled-components'

const Background = styled.div`
  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext.light {
    background-color: var(--text-1);
    color: var(--tooltiptext);
    border: 1px solid var(--bg-17);
  }

  .tooltip .tooltiptext.dark {
    background-color: var(--tolltipbg);
    color: var(--text-1);
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    position: absolute;
    width: 12rem;
    text-align: center;
    padding: 0.5rem;
    border-radius: 0.6rem;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
    box-shadow: 0 2px 6px var(--bg-17);
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

  .tooltip-right {
    top: -5px;
    left: 125%;
  }

  .tooltip-right::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -0.5rem;
    border-width: 0.5rem;
    border-style: solid;
    border-color: transparent var(--tolltipbg) transparent transparent;
  }

  .tooltip-bottom {
    top: 135%;
    left: 50%;
    margin-left: -6rem;
  }

  .tooltip-bottom::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 1.1rem;
    border-style: solid;
    border-color: transparent transparent var(--tolltipbg) transparent;
  }

  .tooltip-top {
    bottom: 125%;
    left: 50%;
    margin-left: -6rem;
  }

  .tooltip-top::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -0.5rem;
    border-width: 0.5rem;
    border-style: solid;
    border-color: var(--tolltipbg) transparent transparent transparent;
  }

  .tooltip-left {
    top: -5px;
    bottom: auto;
    right: 128%;
  }
  .tooltip-left::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -0.5rem;
    border-width: 0.5px;
    border-style: solid;
    border-color: transparent transparent transparent var(--tolltipbg);
  }

  .arrow {
    position: absolute;
    left: 48%;
    top: -1rem;
    border-left: 0.8rem solid transparent;
    border-right: 0.8rem solid transparent;
    border-bottom: 1rem solid var(--text-1);
    z-index: 1;
  }
`
export default Background

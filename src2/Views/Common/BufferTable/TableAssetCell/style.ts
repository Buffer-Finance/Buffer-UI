import styled from "styled-components";

const Background = styled.div`
  display: grid;
  grid-template-areas: "image head" "image desc" "chip chip";
  grid-template-rows: repeat(3, fit-content);
  justify-content: start;
  width: fit-content;
  /* color: var(--text-1); */
  column-gap: 0.7rem;
  font-size: 1.3rem;

  .grid-head {
    grid-area: head;
    font-weight: 700;
  }
  .grid-desc {
    font-weight: 400;
    grid-area: desc;
  }
  .grid-chip {
    grid-area: chip;
  }
  .grid-asset-image-table {
    grid-area: image;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    object-fit: contain;
    align-self: center;
  }
`;
export default Background;

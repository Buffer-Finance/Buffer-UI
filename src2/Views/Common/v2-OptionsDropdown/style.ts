import styled from "styled-components";

const OptionsDropdownStyles = styled.div`
  width: fit-content;

  @media (max-width: 600px) {
    margin-top: 1.6rem;
  }
  .option-dropdown {
    padding: 0.5rem;
    padding-left: 1.5rem;
    background: var(--primary);
    /* max-width: 17rem; */
    gap: 1rem;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    font-weight: 500;
    white-space: nowrap;
    width: fit-content;
  }
  .dropdown-box {
    .option-items {
      width: 100%;
      @media (max-width: 600px) {
        left: 0%;
        transform: translateX(0%);
      }
    }
  }
  .arrow {
    color: var(--primary);
  }
  .arrow-bg {
    background-color: var(--text-1);
    border-radius: 1rem;
    padding: 0.2rem 0.5rem;
  }
  .optionItem {
    font-family: Relative Pro;
    font-size: 1.3rem;
    font-weight: 500;
    text-transform: capitalize;
    padding: 0.8rem 1.5rem;
    color: var(--text-6);
    :hover,
    .activeButton {
      background-color: var(--bg-14);
      color: var(--text-1);
    }
  }
`;
export { OptionsDropdownStyles };

import styled from '@emotion/styled';

export const LeaderBoardSidebarStyles = styled.div`
  background-color: transparent;
  color: var(--text-6);
  margin-right: 20px;
  grid-template-areas: 'sidebar';
  left: 0;
  top: var(--navbar-height);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 1200px) {
    display: none;
  }

  .dropdown-box {
    .dropdown-items {
      position: inherit;
      .absolute {
        position: absolute;
      }
    }
  }
  .head {
    padding: 0 3.5rem;
  }

  .item {
    color: var(--text-6);
    font-size: 1.4rem;
    padding-left: 20px;
    /* padding-right: 16px; */
    font-weight: 400;
    text-transform: capitalize;
    width: 100%;
    border-radius: 0;
    justify-content: flex-start;
    margin: 4px 0;
    :hover {
      color: var(--text-1);
    }
  }

  .activeLink {
    --text-1: #f7f7f7;
    color: var(--text-1);
    font-weight: 600;

    ::after {
      content: '';
      position: absolute;
      width: 2px;
      height: 75%;
      background-color: var(--primary);
      right: -2px;
    }
  }
  .MuiButton-root {
    padding-top: 0;
    padding-bottom: 0;
    min-width: 0;
  }
`;

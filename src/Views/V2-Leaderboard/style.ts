import styled from "@emotion/styled";

export const LeaderBoardStyles = styled.div`
  /* margin-left: calc(var(--leaderboard-sidebar-width) + var(--global-padding)); */
  padding-right: 20px;
  /* padding-left: calc(var(--global-padding) + 1rem); */
  display: grid;
  grid-template: "sidebar main";
  grid-template-columns: auto 1fr;
  @media (max-width: 1200px) {
    grid-template: "main";

    margin-left: 0px;
    padding: 0 1.2rem;
  }
  @media (max-width: 600px) {
    margin-left: 0px;
    padding: 0 0.8rem;
  }
  @media (max-width: 400px) {
    margin-left: 0px;
    padding: 0 0.6rem;
  }

  .mobile-navbar-leaderboard {
    display: flex;
    row-gap: 2rem;
  }
  .mobile-league-btn {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
  }
  .league-btn-wrapper {
    border-radius: 40%;
    padding: 0.8rem;
    opacity: 0.35;
    /* background-color: var(--bg-23); */
    &.active {
      opacity: 1;
    }
  }
`;

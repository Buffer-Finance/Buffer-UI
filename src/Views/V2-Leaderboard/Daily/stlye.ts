import styled from "@emotion/styled";

export const DailyStyles = styled.div`
  color: var(--text-1);
  /* width: fit-content; */
  min-height: 80vh;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;

  .winner-card {
    border-right: 1px solid #2d2d3d;
    padding: 0 30px;

    :first-of-type {
      padding-left: 0;
    }
    :last-of-type {
      padding-right: 0;
      border: none;
    }
    @media (max-width: 600px) {
      width: 50%;
      padding: 0;
      :nth-of-type(even) {
        border-right: none;
      }
    }
  }
  .items-dd {
    font-size: 1.4rem;
    &:hover,
    &.active {
      color: white;
    }
  }
  .filter-dd {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 1.4rem;
  }

  .card-pad {
    padding: 0 3.5rem;
  }
  .daily-contest-dd {
    background: #191b20;
    border-radius: 1rem;
  }
`;

export const LeaderBoardTableStyles = styled.div`
  .trophy {
    left: -4.5rem;
    top: -0.2rem;
  }

  .table-width {
    width: min(100%, 590px);
  }
`;

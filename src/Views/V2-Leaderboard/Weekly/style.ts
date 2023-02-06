import styled from "@emotion/styled";
import { DailyStyles as DailyBackground } from "../Daily/stlye";
export const WeeklyBackground = styled(DailyBackground)`
  color: var(--text-1);
  /* width: fit-content; */

  .winner-card {
    border-right: 1px solid #2d2d3d;
    @media (max-width: 600px) {
      :nth-of-type(even) {
        border-right: none;
      }
    }
  }

  .card-pad {
    padding: 0 3.5rem;
  }
  .season-skel {
    width: 21rem;
    min-height: 5.7rem;
    border-radius: 1.4rem;
    &.extra-wide {
      width: 45vw;
      min-height: 8.3rem;
      display: block;
    }
    &.xl {
      width: 100%;
      min-height: 25rem;
      display: block;
      /* margin-bottom:4rem; */
    }
  }
  .img-container {
    position: relative;
  }
  .avatar-img-hero {
    width: 20rem;
    height: 20rem;
    border-radius: 1.4rem;
    object-fit: cover;
    outline: none;
    border: none;
    @media (max-width: 600px) {
      width: 15rem;
      height: 15rem;
    }
    /* position:relative; */
  }
  .league-img {
    width: 5rem;
    height: 5rem;
    @media (max-width: 600px) {
      display: none;
    }
  }
  .league-logo {
    /* height:5rem; */
    height: 2.7rem;
  }
  .league-logo-sm {
    height: 1.8rem;
  }
  .learn-more {
    color: var(--bg-20);
    display: inline-flex;
    font-weight: 500;
    justify-content: center;
    row-gap: 0.5rem;
    cursor: pointer;
    align-items: center;
    &:hover {
      text-decoration: underline;
    }
  }
  .nft-badge {
    position: absolute;
    top: 0;
    left: 1.4rem;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
      rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    .badge-img {
      width: 21px;
      height: 21px;
      object-fit: cover;
    }
  }
  .sm-width-none {
    @media (max-width: 600px) {
      width: auto;
    }
  }

  .top-flex {
    display: flex;
    justify-content: space-between;
    @media (max-width: 600px) {
      flex-direction: column;
    }
  }
  .mobile-info {
    @media (min-width: 600px) {
      display: none;
    }
    display: flex;
    flex-direction: column;
    width: 100%;

    .bt {
      border-top: 1px solid #2d2d3d;
    }
    .row-league {
      width: 50%;
      &.b {
        border-left: 1px solid #2d2d3d;
      }
    }
  }
`;

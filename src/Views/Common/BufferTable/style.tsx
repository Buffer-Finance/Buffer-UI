import styled from '@emotion/styled';

export const TableBackground = styled.div<{
  overflow?: boolean;
  isBodyTransparent: boolean;
  shouldShowMobile: boolean;
}>`
  --border-radius: 3px;
  --padding-left: 15px;
  overflow-x: hidden;
  flex-grow: 1;
  height: ${(props) => (props.overflow ? '300px' : 'auto')};
  padding-bottom: ${(props) => (props.overflow ? '10px' : 'auto')};
  border-radius: 12px 12px 0px 0px;
  & ::-webkit-scrollbar {
    background: var(--bg-grey);
    height: 2px !important;
    width: 3px !important;
  }

  .rotate {
    transition: transform 0.3s ease;
  }

  .rotate-180 {
    transform: rotate(180deg);
  }
  .accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 10s ease-in-out;
  }

  .open {
    max-height: 1000px;
  }
  @media (max-width: 1000px) {
    height: auto;
  }
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 3px;
    background: transparent;
    font-size: 1.6rem;

    .table-header {
      background: #171722;

      .table-head {
        &:first-of-type {
          padding-left: var(--padding-left);
        }
        .MuiTableSortLabel-root:hover,
        .MuiTableSortLabel-icon:hover {
          color: white;
        }
        .Mui-active {
          color: #c3c2d4;
          .MuiTableSortLabel-icon {
            color: #c3c2d4;
          }
        }
      }

      .table-row-head {
        border-radius: 0px;
      }

      th {
        text-transform: capitalize;
        font-size: 1.4rem;
        font-weight: 400;
        color: var(--text-6);
        border: none;
        background: var(--bg-2);
        padding: ${({ shouldShowMobile }: { shouldShowMobile: boolean }) =>
          shouldShowMobile ? '12px 10px' : '12px 0px'};

        &:first-of-type {
          padding-left: 1.6rem;
          border-radius: var(--border-radius) 0 0 var(--border-radius);
        }
        &:last-of-type {
          padding-right: 0.6rem;
          border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }
        &:hover {
          color: white;
        }
        @media (max-width: 1300px) {
          border-radius: none;
        }
      }
    }
    .table-body {
      .table-row {
        font-family: 'Relative Mono', 'Relative Pro' !important;
        margin-top: 2px;
        background: ${(props) =>
          props.isBodyTransparent ? 'transparent' : '#171722'};

        --selected-row-border: none;
        border-left: var(--selected-row-border);
        transition: 200ms;
        font-size: 1.6rem;
        cursor: pointer;
        &:hover {
          background: #232334;
          color: white;
        }
        &.active {
          --selected-row-border: 5px solid var(--primary);
        }
        &.blured {
          opacity: 0.46;
        }
        &.highlight {
          background: var(--bg-4);
        }

        &.skel {
          background: transparent;
        }
        &.disable-animation {
          &:hover {
            transform: scaleX(1);
          }
        }

        .transparent-hover {
          &:hover {
            background: var(--bg-19);
          }
          &.active {
            background: var(--bg-19);
            --selected-row-border: none;
          }
          &.blured {
            opacity: 1;
          }
        }

        .skel-cell {
          padding: 0;
          margin: 0;
          border-bottom: none;
          border-top: none;
          .skel {
            background-color: var(--bg-8);
            width: 100%;
            height: 18rem;
            border-radius: 1rem;
            margin-top: -3.8rem;
          }
        }

        .table-cell {
          font-family: 'Relative Mono', 'Relative Pro' !important;
          color: rgb(195, 194, 212);
          border-top: none;
          font-size: 13px;
          border-bottom: 0px;
          padding: ${({ shouldShowMobile }: { shouldShowMobile: boolean }) =>
            shouldShowMobile ? '6px 10px' : '6px 0px'};

          &.double-height {
            height: 50px;
          }
          &.sm {
            padding: 1.7rem 0;
          }
          @media (max-width: 600px) {
            font-size: 12px;
          }
        }
        &:hover {
          .table-cell {
            color: white;
          }
        }
      }
      .transparent-hover {
        &:hover {
          background: var(--bg-19);
        }
        &.active {
          background: var(--bg-19);
          --selected-row-border: none;
        }
        &.blured {
          opacity: 1;
        }
      }
    }
    .fotter-bg {
      background-color: white;
      display: flex;
    }
  }
`;

import styled from 'styled-components';

const getBorderType = (props) => {
  if (props?.v1) return 'collapse';
  return 'none';
};
const getBorder = (props) => {
  if (props?.v1) {
    return 'none';
  } else {
    return '1px solid #2d2d3d';
  }
};
const TableBackground = styled.div`
  --border-radius: 8px;
  --padding-left: 15px;
  overflow-x: hidden;
  border-radius: 12px 12px 0px 0px;

  & ::-webkit-scrollbar {
    background: var(--bg-grey);
    height: 2px !important;
    width: 3px !important;
  }

  table {
    border: ${getBorder};
    width: ${({ shouldShowMobile }: { shouldShowMobile: boolean }) =>
      shouldShowMobile ? 'max-content' : 'max(100%, 500px)'}};
    border-collapse: ${getBorderType};
    background: transparent;
    font-size: 1.6rem;
    .table-header {
      background: ${(props) => (props?.v1 ? '#1C1C28' : '#171722')};

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
        color: ${(props) => (props.v1 ? '#C3C2D4' : 'var(--text-6)')};
        border: none;
        background: ${(props) => (props.v1 ? '#1C1C28' : '#171722')};
        padding: ${({ shouldShowMobile }: { shouldShowMobile: boolean }) =>
          shouldShowMobile ? '12px 10px' : '12px 0px'}};

        &:first-of-type {
          padding-left: 0.6rem;
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
        --selected-row-border: none;
        border-top: ${getBorder};
        transition: 200ms;
        font-size: 1.6rem;
        cursor: pointer;
        &:hover {
          backdrop-filter: brightness(1.25);
          filter: brightness(1.25);
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
          color: rgb(195, 194, 212);
          border-top: none;
          font-size: 13px;
          border-bottom: ${getBorder};
          padding: ${({ shouldShowMobile }: { shouldShowMobile: boolean }) =>
            shouldShowMobile ? '6px 10px' : '6px 0px'}};
          
          &.double-height {
            height: 50px;
          }
          &.sm {
            padding: 1.7rem 0;
          }
          &:first-of-type {
            padding-left: var(--padding-left);
          }
          &:last-of-type {
            padding-right: calc(var(--padding-left) - 1rem);
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
export default TableBackground;

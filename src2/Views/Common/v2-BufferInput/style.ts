import styled from "@emotion/styled";

const Background = styled.div`
  max-width: 40rem;
  width: 100%;
  .error-icon {
    --dim: 5.8rem;
    width: var(--dim);
    height: var(--dim);
    margin-right: 0.6rem;
  }
  .err-container {
    position: absolute;
  }
  .temp {
    .background {
      padding: 0.4rem 0.4rem 0.4rem 2rem;
      border-radius: 0.8rem;

      background-color: #1c1c28;
    }
    .inputDesign {
      /* color: var(--text-6); */
      padding: 0;
      font-size: 1.4rem;
    }
    .iconBg {
      .iconButton {
        padding: 0;
      }
      background-color: var(--primary);
      padding: 0.9rem;
      border-radius: 0.8rem;
    }

    .inputStyle {
      /* font-size: 12px; */
      ::placeholder {
        color: #c3c2d4;
      }
    }
  }
`;

export default Background;

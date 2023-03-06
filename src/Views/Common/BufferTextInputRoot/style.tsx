import styled from "styled-components";

const Background = styled.div`
  display:flex;
  flex-direction:column;
  &.ip-border {
    border: 1.14763px solid #2a2a3a;
    border-radius: 11.4px;  
  }
  .background {
    padding: 0.4rem 1.6rem;
    border-radius: 0.8rem;
    /* border: 2px solid var(--bg-8); */
  }
  .bg {
    /* background: var(--bg19-white) !important; */
  }
  .lower-part,
  .upper-part {
    display: flex;
    justify-items: center;
    align-items: center;
  }

  .inputStyle {
    flex: 1;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 0.5rem 0rem;
    font-size: 1.6rem;
    width: 100%;
    color: var(--text-1);

    ::placeholder {
      color: var(--text-6);
    }
  }
  .searchImg {
    width: 1.7rem;
    height: 1.7rem;
  }
  .right-part {
    padding-left: 0.8rem;
  }
  .error-message {
    color: var(--red);
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    font-weight: 400;
  }
`;
export default Background;

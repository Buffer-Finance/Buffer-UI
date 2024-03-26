import { notificationPosition } from '@Views/ABTradePage/type';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
from{
    transform:translateX(150%);

}
to{
    transform:translateX(0%);
}
`;
const fadeOut = keyframes`
from{
    transform:translateX(0%);
}
to{
    transform:translateX(150%);
}
`;

export const Background = styled.div`
  position: fixed;
  bottom: ${(props: { position: number }) => {
    switch (props.position) {
      case notificationPosition.BottomLeft:
        return '0';
      case notificationPosition.BottomRight:
        return '0';
      case notificationPosition.TopLeft:
        return 'unset';
      case notificationPosition.TopRight:
        return 'unset';
    }
    return 'unset';
  }};
  left: ${(props: { position: number }) => {
    switch (props.position) {
      case notificationPosition.BottomLeft:
        return '0';
      case notificationPosition.BottomRight:
        return 'unset';
      case notificationPosition.TopLeft:
        return '0';
      case notificationPosition.TopRight:
        return 'unset';
    }
    return 'unset';
  }};
  right: ${(props: { position: number }) => {
    switch (props.position) {
      case notificationPosition.BottomLeft:
        return 'unset';
      case notificationPosition.BottomRight:
        return '0';
      case notificationPosition.TopLeft:
        return 'unset';
      case notificationPosition.TopRight:
        return '0';
    }
    return 'unset';
  }};
  top: ${(props: { position: number }) => {
    switch (props.position) {
      case notificationPosition.BottomLeft:
        return 'unset';
      case notificationPosition.BottomRight:
        return 'unset';
      case notificationPosition.TopLeft:
        return '0';
      case notificationPosition.TopRight:
        return '0';
    }
    return 'unset';
  }};
  padding: 10px;
  z-index: 1000000;
`;
export const SingleNotification = styled.div`
  position: relative;
  z-index: 100;
  min-width: 15vw;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 60vw;
  width: fit-content;
  font-size: 1.3rem;
  margin: 10px;
  &.fade-in {
    animation: ${fadeIn} 500ms ease;
  }
  &.fade-out {
    animation: ${fadeOut} 500ms ease;
  }
  @media (max-width: 600px) {
    font-size: 1.2rem;
    max-width: 90vw;
  }
  .clear {
    width: 2.4rem;
    height: 2.4rem;
  }
  .icon {
    width: 2rem;
    height: 2rem;
  }
  .check {
    color: green;
  }
  .error {
    color: ${(props) => props.color};
    svg {
      min-width: 24px;
    }
  }
  .msgtext {
    margin: 0 1rem 0 0.5rem;
    text-align: start;
  }
  .content {
    padding: 1rem;
  }

  .icon-dim {
    --dim: 2.1rem;
    min-width: var(--dim);
    max-width: var(--dim);
    margin-top: 3px;
    margin-right: 1rem;
    min-height: var(--dim);
    max-height: var(--dim);
  }
  .custom_alert {
    background-color: #232334;
    border-radius: 14px;
    position: relative;
    display: flex;
    padding: 2.7rem;
    padding-bottom: 2.7rem;
    /* align-items: center; */

    .cross {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      padding: 0;
      height: fit-content;
      svg {
        fill: #fff;
        --dim: 1.4rem;
        width: var(--dim);
        height: var(--dim);
      }
    }
    .message {
      margin-right: 2em;
      display: flex;
      flex-direction: column;
      transition: 300ms ease-in-out;
      span {
        /* font-family: Poppins; */
        font-style: normal;
        font-weight: 400;
        font-size: 1.4rem;

        /* line-height: 27px; */
        color: var(--text-1);
      }
    }
    a {
      /* text-decoration: none; */
      font-weight: 500;
      margin-top: 0.2rem;
      font-size: 1.2rem;
      &:hover {
        text-decoration: underline;
        /* color: var(--text-1); */
      }
    }

    .message--enter {
      transform: translate(0, -300px);
      opacity: 0;
    }
    .message--enter-active {
      opacity: 1;
      transform: translate(0, 0);
    }
    .message--exit {
      opacity: 0;
      transform: translate(0, 300px);
    }
  }
`;
export const Bar = styled.div`
  position: absolute;
  bottom: 0;
  width: ${(props) => props.width};
  background: ${(props) => props.color};
  height: 0.4rem;
`;

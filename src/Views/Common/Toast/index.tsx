import { IconButton } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { SingleNotification, Bar, Background } from './style';
import { useToast } from '../../../contexts/Toast';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useGlobal } from '@Contexts/Global';
import SuccessIcon from '@Assets/Elements/SuccessIcon';
import ErrorIcon from '@Assets/Elements/ErrorIcon';
import FailedSuccessIcon from '@Assets/Elements/FailedSuccess';
import { CLoseSVG } from '@Views/TradePage/Components/CloseSVG';
import { useAtom } from 'jotai';
import { notificationPositionSettingsAtom } from '@Views/TradePage/atoms';

// import { useWindowSize } from "src/Providers";

export const NotificationContext = React.createContext('d');
function Layout(props) {
  const [exit, setExit] = useState(false);
  const [width, setWidth] = useState(0);
  const interval = useRef<any>();
  const dispatch = useToast();
  const { state } = useGlobal();
  const dur = props.toast.inf ? 1000000 : props.toast.timings || 9999;
  // const dimensions = useWindowSize();
  function set() {
    interval.current = setInterval(() => {
      setWidth((width) => width + 1);
    }, dur);
  }
  function clear() {
    clearInterval(interval.current);
  }
  const removeToast = () => {
    dispatch({ type: 'REMOVE-NOTIFICATION', payload: props.toast });
  };

  useEffect(() => {
    if (!props.toast.msg) return;

    set();
    return () => clear();
  }, [props.toast.msg]);
  useEffect(() => {
    if (width > 100) {
      setExit(!exit);
      setTimeout(removeToast, 100);
    }
  }, [width]);

  function entered(e) {
    clear();
  }
  function exited(e) {
    set();
  }

  let color = 'var(--primary)';
  if (props.toast.type && props.toast.type === 'error') {
    color = 'var(--red)';
  }
  if (props.toast.type && props.toast.type === 'success') {
    color = '#4FBF67';
  }
  const notifRef = useRef<HTMLDivElement>();
  if (props.toast.confirmationModal && window.innerWidth > 600) {
    const data = props.toast.confirmationModal;
    return (
      <SingleNotification
        onMouseEnter={entered}
        onMouseLeave={exited}
        className={'bg-1' + (exit ? 'fade-out' : 'fade-in')}
        color={color}
      >
        <></>
        {/* <FinalConfirmationModal data={data} hash={props.toast.hash} /> */}
      </SingleNotification>
    );
  }
  return (
    <SingleNotification
      onMouseEnter={entered}
      onMouseLeave={exited}
      className={'bg-1' + (exit ? 'fade-out' : 'fade-in')}
      color={color}
    >
      <div
        className={`custom_alert ${props.toast.type !== 'success' && 'error'}`}
        ref={notifRef}
      >
        {props.toast?.inf ? (
          props.toast.inf === 2 ? (
            <div>
              <div className="timer"></div>
            </div>
          ) : (
            <div>
              <div className="typing_loader"></div>
            </div>
          )
        ) : props.toast.type === 'loss' ? (
          <FailedSuccessIcon className="icon-dim" />
        ) : props.toast.type === 'success' ? (
          <SuccessIcon className="icon-dim" />
        ) : props.toast.type === 'info' ? (
          <ErrorIcon info className="icon-dim" />
        ) : (
          <ErrorIcon className="icon-dim" />
        )}

        {props.toast.animatable ? (
          <SwitchTransition>
            <CSSTransition
              key={props.toast.msg}
              classNames={'message-'}
              timeout={300}
            >
              <div className="message">
                <span>{props.toast.msg}</span>
                {props.toast.hash && (
                  <a
                    href={`${props.toast.hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Explorer
                  </a>
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        ) : (
          <div className="message">
            <span>{props.toast.msg}</span>
            {props.toast.hash && (
              <a href={`${props.toast.hash}`} target="_blank" rel="noreferrer">
                View on Explorer
              </a>
            )}
          </div>
        )}

        <IconButton className="icon-btn cross" onClick={(e) => setWidth(101)}>
          <CLoseSVG />
        </IconButton>
      </div>
      {props.toast.body && <div>{props.toast.body}</div>}
      {!props.toast.inf && <Bar width={width + '%'} color={color} />}{' '}
    </SingleNotification>
  );
}

function Toasts(props) {
  const [notifPosition] = useAtom(notificationPositionSettingsAtom);
  return (
    <Background position={notifPosition}>
      {props.state.map((notification) => (
        <Layout key={notification.id} toast={notification} />
      ))}
    </Background>
  );
}

export default Toasts;

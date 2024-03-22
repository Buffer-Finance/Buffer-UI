import styled from "styled-components";
import {
  notificationAtom,
  notifications,
  useNotification,
} from "@Hooks/useAlert";
import { useAtom } from "jotai";
import { notificationMapping } from "./notifications";
import { Warning } from "./warning";

const NotificationsStyles = styled.div`
  grid-area: Notification;
`;

export const Notifications = () => {
  const [notificationState] = useAtom(notificationAtom);
  const { closeNotification } = useNotification();

  return (
    <NotificationsStyles>
      {Object.keys(notificationState).map((notification: notifications) => (
        <Warning
          state={notificationState[notification]}
          closeWarning={() => closeNotification(notification)}
          key={notification}
          body={notificationMapping[notification].body}
          shouldAllowClose={notificationMapping[notification].shouldClose}
        />
      ))}
    </NotificationsStyles>
  );
};

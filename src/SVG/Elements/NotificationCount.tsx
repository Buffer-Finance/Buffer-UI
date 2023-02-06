import * as React from 'react'

const NotificationCount = ({ text, ...props }) => (
  <div className="notif-container">
    <span className="notif-text">{text}</span>
  </div>
)

export default NotificationCount

import * as React from 'react'
import { SVGProps } from 'react'

const ErrorIcon = (props) => {
  const isInfo = props.info
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect
        x={0.394}
        y={0.394}
        width={23.212}
        height={23.212}
        rx={11.606}
        fill={isInfo ? 'var(--primary)' : 'var(--red)'}
        stroke={isInfo ? 'var(--primary)' : 'var(--red)'}
        strokeWidth={0.788}
      />
      <path
        d="M11.328 14.535h1.246L12.754 6h-1.606l.18 8.535ZM13 16.942c0-.598-.443-1.059-.984-1.059-.573 0-1.016.461-1.016 1.059 0 .597.443 1.058 1.016 1.058.541 0 .984-.46.984-1.058Z"
        fill="var(--bg-4)"
      />
      <path
        d="m11.328 14.535-.25.005.005.245h.245v-.25Zm1.246 0v.25h.245l.005-.245-.25-.005ZM12.754 6l.25.005.005-.255h-.255V6Zm-1.606 0v-.25h-.256l.006.255.25-.005Zm.18 8.785h1.246v-.5h-1.246v.5Zm1.496-.245.18-8.535-.5-.01-.18 8.535.5.01Zm-.07-8.79h-1.606v.5h1.606v-.5Zm-1.856.255.18 8.535.5-.01-.18-8.535-.5.01Zm2.352 10.937c0-.72-.54-1.309-1.234-1.309v.5c.389 0 .734.334.734.809h.5Zm-1.234-1.309c-.72 0-1.266.583-1.266 1.309h.5c0-.47.34-.809.766-.809v-.5Zm-1.266 1.309c0 .726.545 1.308 1.266 1.308v-.5c-.426 0-.766-.34-.766-.808h-.5Zm1.266 1.308c.694 0 1.234-.588 1.234-1.308h-.5c0 .474-.345.808-.734.808v.5Z"
        fill="var(--bg-4)"
      />
    </svg>
  )
}

export default ErrorIcon

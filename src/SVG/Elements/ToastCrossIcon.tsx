import * as React from 'react'
import { SVGProps } from 'react'

const ToastCrossIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m5.95 5 2.857-2.858a.67.67 0 0 0-.947-.947L5.002 4.053 2.144 1.195a.67.67 0 1 0-.947.947L4.055 5 1.197 7.858a.67.67 0 0 0 .947.947l2.858-2.858L7.86 8.805a.67.67 0 1 0 .947-.947L5.95 5Z"
      fill="var(--text-1)"
    />
  </svg>
)

export default ToastCrossIcon

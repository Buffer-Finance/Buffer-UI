import * as React from 'react'
import { SVGProps } from 'react'

const RevenueSharingIcon = (props: any) => {
  return (
    <svg width={21} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.672 11.27h7.68c0 3.997-3.47 7.283-7.68 7.283-4.22 0-7.68-3.286-7.68-7.282s3.47-7.282 7.68-7.282v7.282Z"
        stroke="currentColor"
        fill={props.active ? 'currentColor' : ''}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.812 8.317V1.035c2.04 0 3.99.767 5.43 2.13 1.44 1.364 2.25 3.22 2.25 5.143h-7.68v.01Z"
        stroke="currentColor"
        fill={props.active ? 'currentColor' : ''}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export default RevenueSharingIcon

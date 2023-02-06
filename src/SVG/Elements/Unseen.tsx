import * as React from 'react'
import { SVGProps } from 'react'

const UnseenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={7} cy={7} r={7} fill="#C4C4C4" />
  </svg>
)

export default UnseenIcon

import * as React from 'react'
import { SVGProps } from 'react'

const EnterDisabledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6.30078 7H0.300781V9H6.30078V12L10.3008 8L6.30078 4V7Z" fill="#353945" />
    <path
      d="M15.3008 16H1.30078C0.748781 16 0.300781 15.552 0.300781 15V11H2.30078V14H14.3008V2H2.30078V5H0.300781V1C0.300781 0.448 0.748781 0 1.30078 0H15.3008C15.8528 0 16.3008 0.448 16.3008 1V15C16.3008 15.552 15.8528 16 15.3008 16Z"
      fill="#353945"
    />
  </svg>
)

export default EnterDisabledIcon

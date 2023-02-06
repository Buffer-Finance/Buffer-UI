import * as React from 'react'
import { SVGProps } from 'react'

const OptionsIcon = (props: any) => {
  if (props.active) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M14.407 9.096l-2.89 3.48a.783.783 0 01-.95.196l-.09-.055-2.85-1.998-2.51 3.016a.726.726 0 01-.59.28.882.882 0 01-.46-.14.668.668 0 01-.21-.887l.061-.084 2.96-3.594a.786.786 0 01.5-.28c.2-.019.4.029.57.15l2.77 2.035 2.42-2.922a.792.792 0 01.7-.289c.26.019.5.177.61.41a.66.66 0 01-.08.7l.04-.018zm-.83-6.067c0-.233.02-.466.06-.7H5.588c-3.4 0-5.4 1.886-5.4 5.059v6.906c0 3.165 2 5.04 5.4 5.04h7.39c3.4 0 5.4-1.875 5.4-5.04V6.763c-.25.037-.49.064-.74.064-2.24 0-4.06-1.698-4.06-3.798z"
          clipRule="evenodd"
        ></path>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M17.777.667c-1.33 0-2.41 1.008-2.41 2.25 0 1.24 1.08 2.248 2.41 2.248s2.41-1.008 2.41-2.249-1.08-2.25-2.41-2.25z"
          clipRule="evenodd"
        ></path>
      </svg>
    )
  }
  return (
    <svg width={21} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m5.458 12.827 2.994-3.684 3.414 2.54 2.929-3.58"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx={18.209}
        cy={2.806}
        rx={1.922}
        ry={1.82}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.138 1.783H5.87C2.86 1.783.992 3.803.992 6.654v7.654c0 2.852 1.83 4.863 4.878 4.863h8.604c3.012 0 4.88-2.011 4.88-4.863V7.643"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default OptionsIcon

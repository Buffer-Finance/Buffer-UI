import * as React from 'react'
import { SVGProps } from 'react'

const HomeIcon = (props: any) => {
  const active = props.active

  return (
    <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        clipRule="evenodd"
        d="M13.629 1.562h2.89c1.195 0 2.165.926 2.165 2.07V6.39c0 1.142-.97 2.069-2.165 2.069h-2.89c-1.197 0-2.167-.927-2.167-2.07V3.632c0-1.143.97-2.069 2.167-2.069ZM3.158 1.562h2.889c1.196 0 2.166.926 2.166 2.07V6.39c0 1.142-.97 2.069-2.166 2.069H3.158C1.962 8.46.992 7.533.992 6.39V3.632c0-1.143.97-2.069 2.166-2.069ZM3.158 11.419h2.889c1.196 0 2.166.926 2.166 2.07v2.758c0 1.143-.97 2.07-2.166 2.07H3.158c-1.196 0-2.166-.927-2.166-2.07V13.49c0-1.144.97-2.07 2.166-2.07ZM13.63 11.419h2.889c1.195 0 2.165.926 2.165 2.07v2.758c0 1.143-.97 2.07-2.165 2.07h-2.89c-1.197 0-2.166-.927-2.166-2.07V13.49c0-1.144.97-2.07 2.166-2.07Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : ''}
      />
    </svg>
  )
}

export default HomeIcon

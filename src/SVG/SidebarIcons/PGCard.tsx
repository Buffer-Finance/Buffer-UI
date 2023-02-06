import * as React from 'react'
import { SVGProps } from 'react'

const PGCard = (props: any) => {
  if (props.active) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M15.56 15.962a.843.843 0 01-.83.75.827.827 0 01-.83-.75v-3.28a.806.806 0 01.38-.79.839.839 0 011.28.79v3.28zm-4.6 0a.827.827 0 01-.83.75.843.843 0 01-.83-.75V5.772a.84.84 0 011.281-.79c.27.169.418.48.378.79v10.19zm-4.66 0a.827.827 0 01-.83.75c-.43 0-.79-.32-.83-.75v-6.91a.84.84 0 01.39-.79c.27-.17.61-.17.88 0s.42.479.39.79v6.91zM14.75.852H5.41C2.01.852.08 2.78.08 6.182v9.34c0 3.4 1.93 5.33 5.33 5.33h9.34c3.4 0 5.33-1.93 5.33-5.33v-9.34c-.01-3.401-1.93-5.33-5.33-5.33z"
          clipRule="evenodd"
        ></path>
      </svg>
    )
  }
  return (
    <svg width={22} height={22} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.363 9.08v6.496M11.03 5.971v9.605M15.62 12.513v3.063"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        clipRule="evenodd"
        d="M15.677 1.375H6.306c-3.267 0-5.314 2.19-5.314 5.289v8.361c0 3.1 2.038 5.29 5.314 5.29h9.371c3.277 0 5.315-2.19 5.315-5.29V6.664c0-3.1-2.038-5.289-5.315-5.289Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PGCard

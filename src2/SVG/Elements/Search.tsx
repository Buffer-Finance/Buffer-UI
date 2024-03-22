import * as React from "react"

const SearchIcon = (props) => (
  <svg
    width={19}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.161.002C4.605.002.911 3.614.911 8.07c0 4.456 3.694 8.068 8.25 8.068 1.949 0 3.74-.66 5.15-1.765l2.682 2.615.071.06c.25.18.602.16.828-.061a.612.612 0 0 0-.002-.879l-2.65-2.584a7.942 7.942 0 0 0 2.17-5.454c0-4.456-3.693-8.068-8.249-8.068Zm0 1.243c3.855 0 6.98 3.055 6.98 6.825 0 3.769-3.125 6.825-6.98 6.825-3.854 0-6.98-3.056-6.98-6.825 0-3.77 3.126-6.825 6.98-6.825Z"
      fill="var(--text-1)"
    />
  </svg>
)

export default SearchIcon

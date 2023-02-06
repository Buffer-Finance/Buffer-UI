const ShieldIcon = (props) => (
  <svg
    width={50}
    height={50}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#a)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.111 6.5c-2.025 1.382-4.444 2.212-6.451 2.212h-.54l.014 4.123c.013 4.097.014 4.126.115 4.48.358 1.268 1.09 2.49 2.166 3.617 1.69 1.77 3.956 2.994 5.345 2.887 1.205-.093 2.728-.85 4.134-2.057 1.404-1.204 2.4-2.574 2.891-3.976.278-.791.278-.794.278-5.128V8.712h-.56c-1.968-.001-4.298-.796-6.363-2.171l-.551-.367-.478.326Zm3.72 6.21c.266.175.483.34.483.365 0 .025-.809 1.248-1.795 2.718-1.236 1.841-1.842 2.705-1.947 2.776a.602.602 0 0 1-.626.023c-.078-.044-.6-.625-1.161-1.29l-1.216-1.445-.197-.234.458-.383c.252-.21.476-.39.497-.396.03-.01 1.197 1.335 1.787 2.059.065.08.174-.07 1.62-2.226.853-1.271 1.565-2.306 1.581-2.3.017.007.248.157.515.333Z"
        fill="#A3E3FF"
      />
    </g>
    <path fill="#A3E3FF" d="M11.651 12.165h8.382v7.255h-8.382z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.98 11.755c.175.045.437.175.593.293.248.187.453.483.552.799.062.199.079.572.035.78a1.624 1.624 0 0 1-.88 1.125c-.01.004.142.62.341 1.371a974.975 974.975 0 0 1 .485 1.834c.05.18.033.256-.067.308-.088.046-2.806.046-2.894 0-.106-.055-.118-.127-.057-.35a2014.208 2014.208 0 0 1 .475-1.791c.198-.751.352-1.368.34-1.372a2.098 2.098 0 0 1-.362-.239 1.872 1.872 0 0 1-.23-.251 1.595 1.595 0 0 1-.001-1.905c.246-.332.64-.57 1.04-.633.165-.025.472-.01.63.031Z"
      fill="#34264A"
    />
    <path
      d="M21.842 0h-12.5a8.75 8.75 0 0 0-8.75 8.75v12.5A8.75 8.75 0 0 0 9.342 30h12.5a8.75 8.75 0 0 0 8.75-8.75V8.75A8.75 8.75 0 0 0 21.842 0Z"
      fill="url(#b)"
      fillOpacity={0.25}
    />
    <path
      d="M21.842.625h-12.5A8.125 8.125 0 0 0 1.217 8.75v12.5a8.125 8.125 0 0 0 8.125 8.125h12.5a8.125 8.125 0 0 0 8.125-8.125V8.75A8.125 8.125 0 0 0 21.842.625Z"
      stroke="#fff"
      strokeOpacity={0.1}
    />
    <defs>
      <linearGradient
        id="b"
        x1={15.592}
        y1={0}
        x2={15.592}
        y2={30}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A3E3FF" />
        <stop offset={1} stopColor="#B85FFF" stopOpacity={0} />
      </linearGradient>
      <filter
        id="a"
        x={4.121}
        y={6.174}
        width={22.942}
        height={25.652}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1607_11316"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_1607_11316"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default ShieldIcon;

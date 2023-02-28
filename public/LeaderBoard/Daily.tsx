import { SVGProps } from 'react';

const Daily = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="47"
    height="47"
    viewBox="0 0 47 47"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse
      cx="23.0192"
      cy="23.0455"
      rx="23.0192"
      ry="23.0455"
      fill={props.color}
    />
    <path
      d="M27.4974 19.1465H19.3838C17.83 20.9244 15.0454 24.5287 15.0454 27.5512C15.0454 28.916 15.6512 33.3699 23.4406 33.3699C31.23 33.3699 31.8357 28.916 31.8357 27.5512C31.8357 24.5287 29.0511 20.9244 27.4974 19.1465Z"
      fill="white"
    />
    <path
      d="M22.7929 17.8518V15.2658H24.0844V17.8518H27.0667L29.6498 12.6797H17.2275L19.8107 17.8518H22.7929Z"
      fill="white"
    />
  </svg>
);

export default Daily;

export const CLoseSVG: React.FC<{
  svgProps?: React.SVGProps<SVGSVGElement>;
  className?: string;
}> = ({ svgProps, className = '' }) => {
  return (
    <svg
      width="18"
      height="17"
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...svgProps}
    >
      <rect width="18" height="17" rx="8.5" fill="#171722" />
      <path
        d="M11.8838 5.05602L12.652 5.72443L6.05356 11.7948L5.28531 11.1263L11.8838 5.05602ZM5.7934 5L13 11.2701L12.2066 12L5 5.7299L5.7934 5Z"
        fill="#C3C2D4"
      />
    </svg>
  );
};

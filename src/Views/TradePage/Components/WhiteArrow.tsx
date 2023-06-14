export const WhiteDownArrow: React.FC<{
  className?: string;
  svgProps?: React.SVGProps<SVGSVGElement>;
}> = ({ className, svgProps }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      className={className}
      {...svgProps}
    >
      <path d="M4 5L0.535898 0.5H7.4641L4 5Z" fill={'currentColor'} />
    </svg>
  );
};

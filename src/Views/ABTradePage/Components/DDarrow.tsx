export const DDarrow: React.FC<{ open: boolean; className?: string }> = ({
  open,
  className = '',
}) => {
  return (
    <svg
      width="5"
      height="3"
      viewBox="0 0 5 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transform transition-transform duration-300 ${
        open && 'rotate-180'
      } ${className}`}
    >
      <path
        d="M4.4125 0L2.5 1.85425L0.5875 0L0 0.57085L2.5 3L3.75 1.78543L5 0.57085L4.4125 0Z"
        fill="#C3C2D4"
      />
    </svg>
  );
};

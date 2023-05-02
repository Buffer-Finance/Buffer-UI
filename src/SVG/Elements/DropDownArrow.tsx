import { ArrowDropDownRounded } from '@mui/icons-material';

export const DropdownArrow: React.FC<{ open: boolean; className?: string }> = ({
  open,
  className = '',
}) => {
  return (
    <ArrowDropDownRounded
      className={`transition-all duration-200 ease-out dropdown-arrow ${
        open ? 'origin rotate-180' : ''
      } ${className}`}
    />
  );
};

export const DropDownArrowSm: React.FC<{
  open: boolean;
  className?: string;
}> = ({ open, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={10}
      height={8}
      fill="none"
      className={`transition-all duration-200 ease-out  ${
        open ? 'origin rotate-180' : ''
      } ${className}`}
    >
      <path
        fill="#C2C1D3"
        fillRule="evenodd"
        d="M9.57 1.287C9.14.838 8.465.502 8.035.95H1.855C1.425.502.75.838.322 1.287a1.183 1.183 0 0 0 0 1.622l3.846 4.016c.43.448 1.125.448 1.555 0l3.846-4.016c.43-.448.43-1.174 0-1.622Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
export default DropdownArrow;

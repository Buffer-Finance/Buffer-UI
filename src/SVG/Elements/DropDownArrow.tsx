import { ArrowDropDownRounded } from "@mui/icons-material";

export const DropdownArrow: React.FC<{ open: boolean; className?: string }> = ({
  open,
  className = "",
}) => {
  return (
    <ArrowDropDownRounded
      className={`transition-all duration-200 ease-out dropdown-arrow ${
        open ? "origin rotate-180" : ""
      } ${className}`}
    />
  );
};
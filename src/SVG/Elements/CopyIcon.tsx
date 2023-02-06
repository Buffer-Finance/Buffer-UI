import { SVGProps } from "react";
import { useGlobal } from "@Contexts/Global";
const CopyIcon = (props: SVGProps<SVGSVGElement>) => {
  const { state } = useGlobal();
  return (
    <svg width={17} height={17} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        opacity={state.isDarkMode ? 1 : 0.5}
        d="M11.281 12.56h-10a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1Z"
        fill="currentColor"
      />
      <path
        d="M15.281 16.56h-11v-2h10v-10h2v11a1 1 0 0 1-1 1Z"
        fill="currentColor"
        opacity={state.isDarkMode ? 1 : 0.5}
      />
    </svg>
  );
};

export default CopyIcon;

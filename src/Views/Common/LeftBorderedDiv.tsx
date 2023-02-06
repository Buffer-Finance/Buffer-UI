import { ReactNode } from "react";
import RetryIcon from "src/SVG/Elements/RetryIcon";
import TimerIcon from "src/SVG/Elements/TimerIcon";

const IconMapping = {
  timer: TimerIcon,
  retry: RetryIcon,
};

export type IconType = keyof typeof IconMapping;

interface ILeftBorderedDiv {
  className?: string;
  type: IconType;
  children?: ReactNode;
}

const LeftBorderedDiv: React.FC<ILeftBorderedDiv> = ({
  className,
  children,
  type,
}) => {
  const ActiveIcon = IconMapping[type];
  return (
    <div
      className={`${className} w-full rounded-[5px] bg-1 bord-l flex py-4 items-center justify-start whitespace-pre-wrap`}
    >
      <ActiveIcon className="ml-5 mr-3 min-w-fit" />
      {/* <TimerIcon /> */}
      {children}
    </div>
  );
};

export { LeftBorderedDiv };

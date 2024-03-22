import { ReactNode } from "react";
import Background from "./style";

interface Itoggler {
  children: ReactNode[];
  activeIdx: number;
  setActiveIdx: (a: number) => void;
  className?: string;
}
const Toggler: React.FC<Itoggler> = ({
  children,
  className,
  activeIdx,
  setActiveIdx,
}) => {
  return (
    <Background className={className}>
      {children.map((child, idx) => (
        <div
          key={idx}
          className={`toggle-tab ${idx === activeIdx && "active"}`}
          onClick={() => setActiveIdx(idx)}
        >
          {child}
        </div>
      ))}
    </Background>
  );
};

export default Toggler;

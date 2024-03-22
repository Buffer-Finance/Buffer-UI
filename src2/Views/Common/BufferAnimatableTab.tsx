import { useState, useEffect, ReactNode, Children, useCallback } from "react";
import { isEqual } from "lodash";
interface IBufferAnimatableTab {
  className?: string;
  children?: ReactNode[];
}
const selected = {};
const wrapper = {};

let BufferAnimatableTab: {
  Container: React.FC<IBufferAnimatableTab>;
  Tab: React.FC<{ className?: string; children?: ReactNode; active?: boolean }>;
} = {
  Container: ({ className, children }) => {
    const [hoveredDim, setHoveredDim] = useState(null);
    useEffect(() => {
      if (hoveredDim) {
        const wrapperDim = wrapper.current.getBoundingClientRect();

        selected.current.style.height = hoveredDim.height + "px";
        selected.current.style.width = hoveredDim.width + "px";
        selected.current.style.left = hoveredDim.x - wrapperDim.x + "px";
      }
    }, [hoveredDim]);
    const cb = useCallback((e) => {
      const dim = e.target.getBoundingClientRect();
      if (JSON.stringify(hoveredDim) != JSON.stringify(dim)) setHoveredDim(dim);
    }, []);
    return (
      <>
        <div
          onMouseEnter={cb}
          onMouseOver={cb}
          onMouseLeave={() => {
            setHoveredDim(null);
          }}
          ref={(ref) => (wrapper.current = ref)}
          className={
            className + " relative w-fit flex flex-row mx-auto rounded-lg bg-1"
          }
        >
          <>
            {children.map((t, idx) => {
              return (
                <span key={idx} className="unset">
                  {t}
                </span>
              );
            })}
            <div
              className={`absolute z-10 border-2 border-[blue] bg-blue top-0 left-0  opacity-20 rounded-lg transition-all pointer ${
                !hoveredDim && "hidden"
              }`}
              ref={(ref) => (selected.current = ref)}
              onMouseOver={(e) => {
                e.stopPropagation();
              }}
            />
          </>
        </div>
      </>
    );
  },
  Tab: ({ className, children, active }) => {
    return (
      <div
        className={
          className +
          "  text-f15 py-3 px-[30px] rounded-lg pointer z-20 " +
          (active && "bg-blue overflow-hidden z-20")
        }
      >
        {children}
      </div>
    );
  },
};
export default BufferAnimatableTab;

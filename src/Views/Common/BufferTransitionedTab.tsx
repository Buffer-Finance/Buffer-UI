import { ReactNode } from 'react';
interface IBufferTransitionedTab {
  className?: string;
  children?: ReactNode[];
}
const selected: { current: HTMLDivElement | null } = {
  current: null,
};

let BufferTransitionedTab: {
  Container: React.FC<IBufferTransitionedTab>;
  Tab: React.FC<{
    className?: string;
    children?: ReactNode;
    active?: boolean;
    onClick: (a) => void;
  }>;
} = {
  Container: ({ className, children = [] }) => {
    return (
      <>
        <div
          className={
            className +
            ' p-2 relative w-fit flex mx-auto rounded-[10px] bg-[#282b39]'
          }
        >
          <>
            {children.map((t, idx) => {
              return t;
            })}
          </>
        </div>
      </>
    );
  },
  Tab: ({ className, children, active, onClick }) => {
    return (
      <div
        className={
          className +
          '  text-f15 py-3 px-[30px] sm:px-[20px] rounded-[10px] pointer z-20 font-bold text-[#7F87A7] ' +
          (active && 'bg-[#141823] text-1')
        }
        onClick={() => {
          onClick('');
        }}
        ref={(ref) => {
          if (active) {
            selected.current = ref;
          }
        }}
      >
        {children}
      </div>
    );
  },
};
export default BufferTransitionedTab;

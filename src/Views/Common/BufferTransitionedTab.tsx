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
            className + ' relative w-fit flex flex-row mx-auto rounded-lg bg-1'
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
          '  text-f15 py-3 px-[30px] rounded-lg pointer z-20  font-bold ' +
          (active && 'bg-blue')
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

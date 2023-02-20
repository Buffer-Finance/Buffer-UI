import { createArray } from '@Utils/JSUtils/createArray';
import BufferDropdown from '@Views/Common/BufferDropdown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

const Background = styled.div`
  .scrollbar {
    ::-webkit-scrollbar {
      background: var(--bg-grey);
      height: 1px;
      width: 1px;
    }
  }
`;

export function ContestFilterDD({
  count,
  offset,
  setOffset,
}: {
  count: number;
  offset: string | null;
  setOffset: (day: string) => void;
}) {
  const isDD = count > 1;
  const itemsArray = isDD ? createArray(count) : [];

  useEffect(() => {
    if (offset === null) {
      setOffset(count.toString());
    }
  }, [offset]);

  if (!isDD) return <div className="text-buffer-blue">#1</div>;
  return (
    <Background>
      <BufferDropdown
        className="pt8 pb8 bg-1 max-h-[180px] !overflow-y-auto scrollbar"
        rootClass="z-100 w-fit m-auto ]"
        items={itemsArray}
        item={(a: number) => {
          return (
            <button
              onClick={() => {
                setOffset((count - a).toString());
              }}
            >
              <div
                className={`text-6 items-dd flex content-center pb3 pt4 hover ${
                  offset == a.toString() && 'active'
                }`}
              >
                #{count - a}
              </div>
            </button>
          );
        }}
        initialActive={0}
        dropdownBox={(a, isOpen) => (
          <div className={`bg-1 rounded-sm flex items-center pl-3 pr-2`}>
            #{offset}{' '}
            {isDD && (
              <div className="arrow-bg pl-2 pb-1">
                <ExpandMoreIcon
                  className={`arrow  ${isOpen ? 'rotate' : ''} `}
                />
              </div>
            )}
          </div>
        )}
      />
    </Background>
  );
}

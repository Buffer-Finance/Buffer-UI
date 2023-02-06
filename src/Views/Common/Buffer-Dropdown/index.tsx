import { useState, ReactNode, useRef } from 'react';
import Background from './style';
import { useClickAway } from '@Hooks/useClickAway';
import { CSSTransition } from 'react-transition-group';

interface IBufferDropdown {
  items: any[];
  dropdownBox: (a: any, open: boolean, disabled?: boolean) => ReactNode;
  item: (a: any, b: any, c: any, d: boolean) => ReactNode;
  topDecorator?: ReactNode;
  bottomDecorator?: ReactNode;
  className?: string;
  chainDropDown?: boolean;
  rootClass?: string;
  disabled?: boolean;
}

/*
  className - options container
  rootClass - root div class
*/

export const BufferDropdown: React.FC<IBufferDropdown> = ({
  items,
  dropdownBox,
  item,
  topDecorator,
  disabled,
  rootClass,
  bottomDecorator,
  className,
  chainDropDown,
}) => {
  const [open, setOpen] = useState(false);
  const handelClose = () => {
    setOpen(false);
  };
  const handelClick = () => {
    if (disabled) return;
    setOpen((open) => !open);
  };
  const [activeItemIndex, setActiveInex] = useState(0);
  const onChange = ({ property, item }: { property: string; item: any }) => {
    let idx = 0;
    for (let singleItem of items) {
      if (singleItem[property] === item[property]) {
        setActiveInex(idx);
      }
      idx++;
    }
  };
  const wrapperRef = useRef(null);
  const handleClickOutside = (event: MouseEvent) => {
    setOpen(false);
  };
  useClickAway(open ? wrapperRef : null, handleClickOutside);
  return (
    <Background ref={wrapperRef}>
      {items.length ? (
        <div
          className={[
            'dropdown-box',
            rootClass,
            open ? 'active' : rootClass,
          ].join(' ')}
          onClick={handelClick}
        >
          {dropdownBox(items[activeItemIndex], open, disabled)}
          <CSSTransition
            in={open}
            timeout={100}
            classNames={`${
              chainDropDown ? 'chain-dropdown-items-' : 'dropdown-items-'
            }`}
          >
            <div className={`dropdown-items ${className}`} id="mobile-drop">
              {topDecorator}
              {items.map((i, key) =>
                item(i, handelClose, onChange, key === activeItemIndex)
              )}
              {bottomDecorator}
            </div>
          </CSSTransition>
        </div>
      ) : null}
    </Background>
  );
};

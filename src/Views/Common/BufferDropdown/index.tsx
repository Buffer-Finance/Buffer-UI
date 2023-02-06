import { useState, useEffect, ReactNode, useRef } from "react";
import Background from "./style";

import useClickAway from "@Hooks/Utilities/useClickAway";
import { CSSTransition } from "react-transition-group";
interface Imessage {
  position: "top" | "bottom";
  msg: string;
}

interface IBufferDropdown {
  items: any[];
  dropdownBox: (a: any, open: boolean, disabled?: boolean) => ReactNode;
  initialActive: number;
  item: (a: any, b: any, c: any, d: boolean) => ReactNode;
  topDecorator?: ReactNode;
  bottomDecorator?: ReactNode;
  className?: string;
  chainDropDown?: boolean;
  rootClassName?: string;
  rootClass?: string;
  disabled?: boolean;
  deb?: boolean;
}

/*
  className - options container
  rootClass - root div class
*/

const BufferDropdown: React.FC<IBufferDropdown> = ({
  items,
  dropdownBox,
  initialActive,
  item,
  topDecorator,
  disabled,
  rootClass,
  bottomDecorator,
  rootClassName,
  className,
  chainDropDown,
  deb,
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
  const onChange = ({ property, item }) => {
    let idx = 0;
    for (let singleItem of items) {
      if (singleItem[property] === item[property]) {
        setActiveInex(idx);
      }
      idx++;
    }
  };
  deb && console.log("dopen:", open);
  const wrapperRef = useRef(null);
  const handleClickOutside = () => {

    setOpen(false);
  };
  useClickAway(open ? wrapperRef : null, handleClickOutside);
  return (
    <Background ref={wrapperRef} className={rootClassName}>
      {items.length ? (
        <div
          className={[
            "dropdown-box",
            rootClass,
            open ? "active" : rootClass,
          ].join(" ")}
          onClick={handelClick}
        >
          {dropdownBox(items[activeItemIndex], open, disabled)}
          <CSSTransition
            in={open}
            timeout={100}
            classNames={`${
              chainDropDown ? "chain-dropdown-items-" : "dropdown-items-"
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

export default BufferDropdown;

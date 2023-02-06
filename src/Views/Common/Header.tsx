import React, { useState, useEffect, ReactNode } from "react";
import FrontArrow from "src/SVG/frontArrow";

interface IHeader {
  className?: string;
}

let Header: {
  Container: React.FC<IHeader>;
  Icon: React.FC<{ src: string; alt: string; className?: string }>;
  Description: React.FC<{ children: ReactNode; className?: string }>;
  Link: React.FC<{
    className?: string;
    link: string;
    children: ReactNode;
    shouldShowArrow?: boolean;
  }>;
} = {
  Container: ({ className, children }) => {
    return (
      <>
        <div
          className={
            className +
            " flex flex-row items-center justify-center mb-2 text-f22"
          }
        >
          {children[0]}
        </div>
        {children[1]}
      </>
    );
  },
  Icon: ({ className, ...props }) => {
    return (
      <img
        className={
          className + " w-[27px] h-[27px] rounded-[50%] bg-contain mr-[8px] "
        }
        {...props}
      ></img>
    );
  },
  Description: ({ className, children }) => {
    return (
      <div
        className={
          className + " text-3 text-f16 w-fit text-center mx-auto mt-4"
        }
      >
        {children}
      </div>
    );
  },
  Link: ({ className, children, link, shouldShowArrow = true }) => {
    return (
      <a
        className={
          className +
          " light-blue-text ml-[6px]  hover:underline underline-offset-2   whitespace-nowrap cursor-pointer"
        }
        target="_blank"
        href={link}
      >
        {children}
        <span>
          {shouldShowArrow && <FrontArrow className="tml w-fit inline" />}
        </span>
      </a>
    );
  },
};
export default Header;

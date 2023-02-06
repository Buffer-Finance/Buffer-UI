import { ArrowDropDownRounded } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ITab } from 'src/Config/getTabs';

export const TabsDropdown = ({
  tabs,
  defaultName,
}: {
  tabs: ITab[];
  defaultName: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <ClickAwayListener
        onClickAway={() => {
          setOpen(false);
        }}
      >
        <div className="z-[1] relative rounded-1">
          <button
            className={`transition-all duration-300 text-4 text-f15  pl-4 pr-1 py-[4px] rounded-[8px] flex items-center ${
              open
                ? 'bg-3 text-1'
                : 'hover:bg-1 hover:text-1 hover:brightness-125'
            } `}
            onClick={() => setOpen(!open)}
          >
            {defaultName}
            <ArrowDropDownRounded
              className={`transition-transform duration-200 ease-out dropdown-arrow ${
                open ? 'origin rotate-180' : ''
              }`}
            />
          </button>

          {open && (
            <div className="transition-all duration-1000 flex-col absolute top-[45px] z-[10000] bg-1 py-[12px] px-[20px] rounded-[8px]">
              {tabs.map((tab, idx) => {
                if (tab.isExternalLink) {
                  return (
                    <button
                      key={tab.name}
                      className={`transition-all duration-300 py-3 text-4 text-f15 hover:text-1 
                       `}
                      onClick={() => {
                        window.open(tab.to, '_blank');
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {tab.Img && (
                          <div className="mr-2">
                            <tab.Img />
                          </div>
                        )}
                        {tab.name}
                      </div>
                    </button>
                  );
                }

                return (
                  <NavLink
                    key={tab.name}
                    to={tab.to}
                    className={({ isActive }) =>
                      `py-3 text-4 text-f15 hover:text-1 ${
                        isActive && 'bg-3 text-1'
                      } `
                    }
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {tab.name}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
};

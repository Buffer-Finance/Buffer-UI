import { Skeleton, Tab, Tabs } from '@mui/material';
import { useGlobal } from '@Contexts/Global';
import { atom } from 'jotai';
import { useAtom } from 'jotai';
import Link from 'react-router';
import Quick from 'public/ComponentSVGS/Quick';
import React from 'react';
import { useState, useEffect } from 'react';
// import { useLeftPannel } from "src/Providers";
import HomeIcon from 'src/SVG/SidebarIcons/Home';
import OptionsIcon from 'src/SVG/SidebarIcons/Options';
import PGIcon from 'src/SVG/SidebarIcons/PG';
import RevenueSharingIcon from 'src/SVG/SidebarIcons/RevenueSharing';
import Background from './style';

interface IVerticalTabs {
  className?: string;
}

export const verticalTab = atom(0);
const VerticalTabs: React.FC<IVerticalTabs> = ({ className }) => {
  const pages = null;
  const { state } = useGlobal();
  const [activeVerticalTab, setActiveVerticalTab] = useAtom(verticalTab);

  const isVisble = false;
  const visibleIdx = activeVerticalTab;
  const dta = [
    {
      name: 'options',
      img: <Quick active={visibleIdx === 0} />,
    },
    {
      name: 'prediction-game',
      img: <PGIcon active={visibleIdx === 1} />,
    },
    {
      name: 'binary-options',
      img: <HomeIcon active={visibleIdx === 2} />,
    },
    {
      name: 'faucet',
      img: <RevenueSharingIcon active={visibleIdx === 3} />,
    },
  ];
  return (
    <Background
      className={`${className} ${!isVisble && 'hide'}`}
      id="leftPannel"
    >
      {/* {state.activePageIdx === null ? ( */}
      {state.activePageIdx === null ? (
        <Skeleton
          variant="rectangular"
          className="left-pannel-skel lc"
        ></Skeleton>
      ) : (
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={visibleIdx}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
          classes={{
            indicator: 'vertical-indicator-style',
            root: 'vertical-tabs-root  f14',
          }}
        >
          {pages[state.activePageIdx]?.subTabs.map((page, idx) => {
            return (
              <Tab
                key={page.name}
                label={page.name}
                onClick={() => {
                  // redirectPage(page);
                  setActiveVerticalTab(idx);
                }}
                icon={dta[idx].img}
                classes={{
                  root: `${className} root-button f14`,
                  selected: 'selected-button',
                }}
              ></Tab>
            );
          })}
        </Tabs>
      )}
    </Background>
  );
};

export default VerticalTabs;

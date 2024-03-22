import { useGlobal } from '@Contexts/Global';
import Link from 'react-router';
import React, { useEffect, useState } from 'react';
import BufferDropdown from '../BufferDropdown';
import { OptionsDropdownStyles } from './style';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OptionsDropdown: React.FC = () => {
  const { state } = useGlobal();
  const [currentPage, setCurrentPage] = useState('');
  let chain = '';
  let asset = '';
  let ref = '';
  if (state.settings.activeChain) {
    chain = state.settings.activeChain.name + '/';
  }
  if (state.settings.activeAsset) {
    asset = '/' + state.settings.activeAsset.name;
  } else {
    if (state.settings.activeChain) {
      asset = '/' + state.settings.activeChain.nativeAsset.name;
    }
  }

  if (chain === '') chain = 'BSC/';
  if (asset === '') asset = '/BNB';

  const tabs = [
    {
      pathname: '/[chain]/call-booster',
      as: `/${chain}call-booster`,
      name: 'Call Boosters',
      slug: 'call-booster',
      id: 10,
      subTabs: [],
    },
    {
      pathname: '/[chain]/insurance',
      as: `/${chain}insurance`,
      name: 'Secured Puts',
      slug: 'insurance',
      id: 11,
      subTabs: [],
    },
    {
      pathname: '/[chain]/kpi',
      as: `/${chain}kpi`,
      name: 'KPI Options',
      slug: 'kpi',
      id: 12,
      subTabs: [],
    },
  ];

  return (
    <OptionsDropdownStyles>
      <BufferDropdown
        items={tabs}
        initialActive={2}
        rootClass=""
        className="option-items"
        dropdownBox={(activeItem, isOpen) => (
          <div className="option-dropdown flex-center">
            {currentPage || 'Select Page'}
            <div className="arrow-bg">
              <ExpandMoreIcon className={`arrow  ${isOpen ? 'rotate' : ''}`} />
            </div>
          </div>
        )}
        item={(singleItem) => (
          <Link
            key={singleItem.name}
            href={singleItem.pathname}
            as={singleItem.as}
          >
            <a className="unset">
              <div
                className="flex-center content-start optionItem"
                key={singleItem.name}
                onClick={() => {
                  setCurrentPage(singleItem.name);
                }}
              >
                {singleItem.name}
              </div>
            </a>
          </Link>
        )}
      />
    </OptionsDropdownStyles>
  );
};
export default OptionsDropdown;

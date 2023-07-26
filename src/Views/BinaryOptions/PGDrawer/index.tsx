import React from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { atom, useAtom } from 'jotai';
import { DrawerState } from '../store';
import { ActiveAsset } from './ActiveAsset';
import { CustomOption } from './CustomOption';
import { Background } from './style';
import { atomWithStorage } from 'jotai/utils';
export default function BinaryDrawer() {
  const [isDrawerOpen] = useAtom(DrawerState);

  return (
    <Drawer open={isDrawerOpen} className={'!h-[100%'} childClass={'!h-[100%]'}>
      <Background className="!h-[100%] flex flex-col">
        <ActiveAsset />
        <CustomOption />
      </Background>
    </Drawer>
  );
}

export const QuickTradeExpiry = atomWithStorage('expiry', '00:05');
export const ammountAtom = atomWithStorage('ammount-v3', '10');

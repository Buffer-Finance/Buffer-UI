import React from "react";
import Drawer from "@Views/Common/V2-Drawer";
import { atom, useAtom } from "jotai";
import { DrawerState } from "../store";
import { ActiveAsset } from "./ActiveAsset";
import { CustomOption } from "./CustomOption";
import { Background } from "./style";
export default function BinaryDrawer() {
  const [isDrawerOpen] = useAtom(DrawerState);

  return (
    <Drawer open={isDrawerOpen} className={"!h-[100%"} childClass={"!h-[100%]"}>
      <Background className="!h-[100%] flex flex-col">
        <ActiveAsset />
        <CustomOption />
      </Background>
    </Drawer>
  );
}
export const approveModalAtom = atom<boolean>(false);

export const atomWithLocalStorage = (key, initialValue) => {
  if (typeof window == "undefined") return atom({ dummy: true });
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};

export const QuickTradeExpiry = atomWithLocalStorage("expiry", "00:05");
export const ammountAtom = atomWithLocalStorage("ammount-v2", 100);
